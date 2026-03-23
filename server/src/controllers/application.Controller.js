import Application from "../models/Application.js";
import Job from "../models/Job.js";
import JobSeeker from "../models/JobSeeker.js";
import Recruiter from "../models/Recruiter.js";

// @desc Apply to a job
// @route POST /api/applications
// @access Private (jobseeker only)
const applyToJob = async (req, res) => {
    try {
        const { jobId, coverLetter, existingResumeUrl } = req.body;

        const job = await Job.findById(jobId);
        if (!job || job.status !== "active") {
            return res.status(404).json({
                success: false,
                message: "Job not found or no longer active"
            });
        }

        // Prevent duplicate applications
        const existing = await Application.findOne({
            job: jobId,
            seeker: req.user.id
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "You have already applied to this job"
            });
        }

        // ─── Determine resume path ───────────────────────────────────
        let resumeUrl = null;

        if (req.file) {
            // New file uploaded — multer already saved it locally
            resumeUrl = `/uploads/job_seekers/resumes/${req.file.filename}`;
        } else if (existingResumeUrl) {
            // Seeker explicitly chose their stored resume
            resumeUrl = existingResumeUrl;
        } else {
            // Fall back to resume on their JobSeeker profile
            const seekerProfile = await JobSeeker.findOne({ user: req.user.id });
            if (seekerProfile?.resumeUrl) {
                resumeUrl = seekerProfile.resumeUrl;
            }
        }

        if (!resumeUrl) {
            return res.status(400).json({
                success: false,
                message: "Resume is required to apply for this job"
            });
        }

        const application = await Application.create({
            job: jobId,
            seeker: req.user.id,
            coverLetter: coverLetter || "",
            resumeUrl: { url: resumeUrl, publicId: "" },
            status: "applied"
        });

        // Push applicant ref to job document
        await Job.findByIdAndUpdate(jobId, {
            $push: { applicants: application._id }
        });

        res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            application
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// @desc Get all applications for logged-in seeker
// @route GET /api/applications/me
// @access Private (jobseeker only)
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ seeker: req.user.id })
            .populate("job", "jobTitle company location jobType status")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// @desc Get all applications for logged-in seeker (required response format)
// @route GET /api/applications/my
// @access Private (jobseeker only)
const getMyApplicationsV2 = async (req, res) => {
    try {
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

        res.status(200).json({
            success: true,
            applications,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// @desc Get all applications for a specific job (recruiter view)
// @route GET /api/applications/job/:jobId
// @access Private (employer only)
const getJobApplications = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        if (job.recruiter.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to view these applications"
            });
        }

        const applications = await Application.find({ job: req.params.jobId })
            .populate("seeker", "fullName email avatar location")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// @desc Get all applications for recruiter across their jobs
// @route GET /api/applications/recruiter
// @access Private (recruiter only)
const getRecruiterApplications = async (req, res) => {
    try {
        const recruiterId = req.user.id;

        // Find applications where the job belongs to this recruiter (job.recruiter is a User ref)
        const applications = await Application.find()
            .populate({
                path: "job",
                select: "jobTitle company location jobType recruiter status createdAt",
                match: { recruiter: recruiterId },
            })
            .populate("seeker", "fullName email avatar location phone")
            .sort({ createdAt: -1 });

        // populate(match) will set job=null when recruiter doesn't match -> filter those out
        const filtered = applications.filter(a => a.job);

        res.status(200).json({
            success: true,
            count: filtered.length,
            applications: filtered
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// @desc Update application status (recruiter only)
// @route PUT /api/applications/:id/status
// @access Private (employer only)
const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["applied", "viewed", "shortlisted", "rejected"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value"
            });
        }

        const application = await Application.findById(req.params.id)
            .populate("job");

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        if (application.job.recruiter.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this application"
            });
        }

        application.status = status;
        await application.save();

        res.status(200).json({
            success: true,
            message: `Application marked as ${status}`,
            application
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// @desc Remove application by recruiter
// @route DELETE /api/applications/:id
// @access Private (recruiter only)
const removeApplicationByRecruiter = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id).populate("job");

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        if (!application.job || application.job.recruiter.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to remove this application"
            });
        }

        await Job.findByIdAndUpdate(application.job._id, {
            $pull: { applicants: application._id }
        });
        await Application.findByIdAndDelete(application._id);

        return res.status(200).json({
            success: true,
            message: "Application removed successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

export {
    applyToJob,
    getMyApplications,
    getJobApplications,
    getRecruiterApplications,
    getMyApplicationsV2,
    updateApplicationStatus,
    removeApplicationByRecruiter
};