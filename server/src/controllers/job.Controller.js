import Job from "../models/Job.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse, sendResponse } from "../utils/ApiResponse.js";

const createJob = async (req, res) => {
    const {
        jobTitle,
        company,
        location,
        jobType,
        salaryMin,
        salaryMax,
        description,
        responsibilities,
        skills,
        experience,
        education,
    } = req.body;

    if (
        !jobTitle ||
        !company ||
        !location ||
        !jobType ||
        !description ||
        !responsibilities ||
        !skills ||
        !Array.isArray(skills) ||
        skills.length === 0 ||
        !experience
    ) {
        throw new ApiError(400, "Please Provide all required fields");
    }

    if (salaryMin && salaryMax && salaryMin > salaryMax) {
        throw new ApiError(400, "Minimum salary cannot be greater than maximum salary");
    }

    const job = await Job.create({
        recruiter: req.user.id,
        jobTitle,
        company,
        location,
        jobType,
        salaryMin,
        salaryMax,
        description,
        responsibilities,
        skills,
        experience,
        education,
    });

    return sendResponse(
        res,
        new ApiResponse(201, { message: "Job posted successfully", job }),
    );
};

const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getAllJobs = async (req, res) => {
    const { search, location, jobType, page = 1, limit = 10 } = req.query;

    const query = { status: "active" };

    if (search) {
        query.$text = { $search: search };
    }
    if (location) {
        query.location = { $regex: escapeRegex(location), $options: "i" };
    }
    if (jobType) {
        query.jobType = jobType;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const jobs = await Job.find(query)
        .populate("recruiter", "fullName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean();

    const total = await Job.countDocuments(query);

    return sendResponse(
        res,
        new ApiResponse(200, {
            results: jobs.length,
            total,
            pages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
            jobs,
        }),
    );
};

const getJobById = async (req, res) => {
    const job = await Job.findById(req.params.id)
        .populate("recruiter", "fullName email avatar")
        .lean();

    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    return sendResponse(res, new ApiResponse(200, { job }));
};

const getMyJobs = async (req, res) => {
    const recruiterId = req.user.id;
    const jobs = await Job.find({ recruiter: recruiterId }).sort({ createdAt: -1 }).lean();

    const data = jobs.map((job) => ({
        ...job,
        applicationsCount: Array.isArray(job.applicants) ? job.applicants.length : 0,
    }));

    return sendResponse(res, new ApiResponse(200, { data }));
};

const updateJob = async (req, res) => {
    delete req.body.recruiter;
    delete req.body.applicants;

    if (req.body.status) {
        req.body.status = req.body.status.toLowerCase();
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
        throw new ApiError(404, "Job not found");
    }
    if (job.recruiter.toString() !== req.user.id.toString()) {
        throw new ApiError(403, "Not authorized to edit this job");
    }

    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    return sendResponse(
        res,
        new ApiResponse(200, { message: "Job updated successfully", job: updated }),
    );
};

const deleteJob = async (req, res) => {
    const job = await Job.findById(req.params.id);
    if (!job) {
        throw new ApiError(404, "Job not found");
    }
    if (job.recruiter.toString() !== req.user.id.toString()) {
        throw new ApiError(403, "Not authorized to delete this job");
    }

    await Job.findByIdAndDelete(req.params.id);
    return sendResponse(res, new ApiResponse(200, { message: "Job deleted successfully" }));
};

export { createJob, getAllJobs, getJobById, getMyJobs, updateJob, deleteJob };
