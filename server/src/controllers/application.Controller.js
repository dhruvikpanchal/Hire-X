import Application from "../models/Application.js";
import Job from "../models/Job.js";
import JobSeeker from "../models/JobSeeker.js";
import Recruiter from "../models/Recruiter.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse, sendResponse } from "../utils/ApiResponse.js";

const applyToJob = async (req, res) => {
    const { jobId, coverLetter, existingResumeUrl } = req.body;

    const job = await Job.findById(jobId);
    if (!job || job.status !== "active") {
        throw new ApiError(404, "Job not found or no longer active");
    }

    const existing = await Application.findOne({
        job: jobId,
        seeker: req.user.id,
    });

    if (existing) {
        throw new ApiError(400, "You have already applied to this job");
    }

    let resumeUrl = null;

    if (req.file) {
        resumeUrl = `/uploads/job_seekers/resumes/${req.file.filename}`;
    } else if (existingResumeUrl) {
        resumeUrl = existingResumeUrl;
    } else {
        const seekerProfile = await JobSeeker.findOne({ user: req.user.id });
        if (seekerProfile?.resumeUrl) {
            resumeUrl = seekerProfile.resumeUrl;
        }
    }

    if (!resumeUrl) {
        throw new ApiError(400, "Resume is required to apply for this job");
    }

    const application = await Application.create({
        job: jobId,
        seeker: req.user.id,
        coverLetter: coverLetter || "",
        resumeUrl: { url: resumeUrl, publicId: "" },
        status: "applied",
    });

    await Job.findByIdAndUpdate(jobId, {
        $push: { applicants: application._id },
    });

    return sendResponse(
        res,
        new ApiResponse(201, {
            message: "Application submitted successfully",
            application,
        }),
    );
};

const getMyApplications = async (req, res) => {
    const applications = await Application.find({ seeker: req.user.id })
        .populate("job", "jobTitle company location jobType status")
        .sort({ createdAt: -1 });

    return sendResponse(
        res,
        new ApiResponse(200, {
            count: applications.length,
            applications,
        }),
    );
};

const getMyApplicationsV2 = async (req, res) => {
    const applications = await Application.find({ seeker: req.user.id })
        .populate("job", "jobTitle company location jobType status salaryMin salaryMax skills recruiter")
        .sort({ createdAt: -1 })
        .lean();

    const userIds = [
        ...new Set(
            applications
                .map((a) => a.job?.recruiter)
                .filter(Boolean)
                .map((id) => id.toString()),
        ),
    ];

    let userIdToRecruiterProfileId = new Map();
    if (userIds.length) {
        const recruiters = await Recruiter.find({ user: { $in: userIds } })
            .select("_id user")
            .lean();
        userIdToRecruiterProfileId = new Map(
            recruiters.map((r) => [r.user.toString(), r._id.toString()]),
        );
    }

    applications.forEach((a) => {
        if (a.job?.recruiter) {
            const uid = a.job.recruiter.toString();
            a.job.recruiterProfileId = userIdToRecruiterProfileId.get(uid) || null;
        }
    });

    return sendResponse(res, new ApiResponse(200, { applications }));
};

const getJobApplications = async (req, res) => {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    if (job.recruiter.toString() !== req.user.id) {
        throw new ApiError(403, "Not authorized to view these applications");
    }

    const applications = await Application.find({ job: req.params.jobId })
        .populate("seeker", "fullName email avatar location")
        .sort({ createdAt: -1 });

    return sendResponse(
        res,
        new ApiResponse(200, {
            count: applications.length,
            applications,
        }),
    );
};

const getRecruiterApplications = async (req, res) => {
    const recruiterId = req.user.id;

    const applications = await Application.find()
        .populate({
            path: "job",
            select: "jobTitle company location jobType recruiter status createdAt",
            match: { recruiter: recruiterId },
        })
        .populate("seeker", "fullName email avatar location phone")
        .sort({ createdAt: -1 });

    const filtered = applications.filter((a) => a.job);

    return sendResponse(
        res,
        new ApiResponse(200, {
            count: filtered.length,
            applications: filtered,
        }),
    );
};

const updateApplicationStatus = async (req, res) => {
    const { status } = req.body;
    const validStatuses = ["applied", "viewed", "shortlisted", "rejected"];

    if (!validStatuses.includes(status)) {
        throw new ApiError(400, "Invalid status value");
    }

    const application = await Application.findById(req.params.id).populate("job");

    if (!application) {
        throw new ApiError(404, "Application not found");
    }

    if (application.job.recruiter.toString() !== req.user.id) {
        throw new ApiError(403, "Not authorized to update this application");
    }

    application.status = status;
    await application.save();

    return sendResponse(
        res,
        new ApiResponse(200, {
            message: `Application marked as ${status}`,
            application,
        }),
    );
};

const removeApplicationByRecruiter = async (req, res) => {
    const application = await Application.findById(req.params.id).populate("job");

    if (!application) {
        throw new ApiError(404, "Application not found");
    }

    if (!application.job || application.job.recruiter.toString() !== req.user.id) {
        throw new ApiError(403, "Not authorized to remove this application");
    }

    await Job.findByIdAndUpdate(application.job._id, {
        $pull: { applicants: application._id },
    });
    await Application.findByIdAndDelete(application._id);

    return sendResponse(
        res,
        new ApiResponse(200, { message: "Application removed successfully" }),
    );
};

export {
    applyToJob,
    getMyApplications,
    getJobApplications,
    getRecruiterApplications,
    getMyApplicationsV2,
    updateApplicationStatus,
    removeApplicationByRecruiter,
};
