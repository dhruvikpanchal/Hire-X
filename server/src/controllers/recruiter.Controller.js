import Recruiter from "../models/Recruiter.js";
import User from "../models/User.js";
import Job from "../models/Job.js";
import mongoose from "mongoose";
import Application from "../models/Application.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse, sendResponse } from "../utils/ApiResponse.js";

const getAllRecruiters = async (req, res) => {
    const recruiters = await Recruiter.find()
        .populate("user", "fullName email avatar location phone")
        .lean();

    return sendResponse(res, new ApiResponse(200, { recruiters }));
};

const getRecruiterById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid recruiter ID");
    }

    const recruiter = await Recruiter.findById(id)
        .populate("user", "fullName email avatar location phone")
        .lean();

    if (!recruiter) {
        throw new ApiError(404, "Recruiter profile not found");
    }

    return sendResponse(res, new ApiResponse(200, { recruiter }));
};

const getRecruiterWithJobs = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid recruiter ID");
    }

    const recruiter = await Recruiter.findById(id)
        .populate("user", "fullName email avatar location phone")
        .lean();

    if (!recruiter) {
        throw new ApiError(404, "Recruiter profile not found");
    }

    const jobs = await Job.find({
        recruiter: recruiter.user?._id,
        $or: [{ status: "active" }, { isActive: true }],
    })
        .sort({ createdAt: -1 })
        .lean();

    return sendResponse(res, new ApiResponse(200, { recruiter, jobs }));
};

const getMyRecruiterProfile = async (req, res) => {
    const userId = req.user.id;

    const recruiter = await Recruiter.findOne({ user: userId })
        .populate("user", "fullName email avatar location phone")
        .lean();

    if (!recruiter) {
        throw new ApiError(404, "Recruiter profile not found");
    }

    return sendResponse(res, new ApiResponse(200, { recruiter }));
};

const updateRecruiterProfile = async (req, res) => {
    const userId = req.user.id;

    const {
        recruiterName,
        phone,
        location,
        jobTitle,
        companyName,
        industry,
        companySize,
        companyWebsite,
        companyDescription,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    user.fullName = recruiterName ?? user.fullName;
    user.phone = phone ?? user.phone;
    user.location = location ?? user.location;
    await user.save();

    const recruiter = await Recruiter.findOne({ user: userId });
    if (!recruiter) {
        throw new ApiError(404, "Recruiter profile not found");
    }

    recruiter.jobTitle = jobTitle ?? recruiter.jobTitle;
    recruiter.companyName = companyName ?? recruiter.companyName;
    recruiter.industry = industry ?? recruiter.industry;
    recruiter.companySize = companySize ?? recruiter.companySize;
    recruiter.companyWebsite = companyWebsite ?? recruiter.companyWebsite;
    recruiter.companyDescription = companyDescription ?? recruiter.companyDescription;
    await recruiter.save();

    return sendResponse(
        res,
        new ApiResponse(200, { message: "Profile updated successfully", recruiter }),
    );
};

const uploadCompanyLogo = async (req, res) => {
    const userId = req.user.id;

    if (!req.file) {
        throw new ApiError(400, "Please upload a company logo");
    }

    const recruiter = await Recruiter.findOne({ user: userId });
    if (!recruiter) {
        throw new ApiError(404, "Recruiter profile not found");
    }

    const logoPath = `/uploads/recruiter/company_logos/${req.file.filename}`;
    recruiter.companyLogo = logoPath;
    await recruiter.save();

    return sendResponse(
        res,
        new ApiResponse(200, {
            message: "Company logo uploaded successfully",
            companyLogo: logoPath,
        }),
    );
};

const uploadRecruiterImage = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "Unauthorized user");
    }

    if (!req.file) {
        throw new ApiError(400, "Please upload an image");
    }

    const avatarPath = `/uploads/recruiter/profile_images/${req.file.filename}`;
    const updatedUser = await User.findByIdAndUpdate(userId, { avatar: avatarPath }, { new: true });

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    return sendResponse(
        res,
        new ApiResponse(200, {
            message: "Profile image uploaded successfully",
            avatar: updatedUser.avatar,
        }),
    );
};

const deleteRecruiterProfile = async (req, res) => {
    const userId = req.user.id;

    const recruiter = await Recruiter.findOneAndDelete({ user: userId });
    if (!recruiter) {
        throw new ApiError(404, "Recruiter profile not found");
    }

    return sendResponse(
        res,
        new ApiResponse(200, { message: "Recruiter profile deleted successfully" }),
    );
};

const getRecruiterDashboard = async (req, res) => {
    const userId = req.user.id;

    const recruiter = await Recruiter.findOne({ user: userId })
        .populate("user", "fullName email avatar location phone")
        .lean();

    const jobIds = await Job.find({ recruiter: userId }).select("_id").lean();
    const ids = jobIds.map((j) => j._id);

    const [jobsPosted, activeJobs, totalApplications, pendingApplications] = await Promise.all([
        Job.countDocuments({ recruiter: userId }),
        Job.countDocuments({ recruiter: userId, status: "active" }),
        ids.length ? Application.countDocuments({ job: { $in: ids } }) : 0,
        ids.length ? Application.countDocuments({ job: { $in: ids }, status: "applied" }) : 0,
    ]);

    const recentJobs = await Job.find({ recruiter: userId })
        .select("jobTitle company location jobType status createdAt")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

    const recentApplications = ids.length
        ? await Application.find({ job: { $in: ids } })
              .populate("job", "jobTitle company location jobType")
              .populate("seeker", "fullName email avatar location phone")
              .sort({ createdAt: -1 })
              .limit(5)
              .lean()
        : [];

    return sendResponse(
        res,
        new ApiResponse(200, {
            recruiter: recruiter || null,
            stats: {
                jobsPosted,
                activeJobs,
                totalApplications,
                pendingApplications,
            },
            recentJobs,
            recentApplications,
        }),
    );
};

export {
    getAllRecruiters,
    getRecruiterById,
    getRecruiterWithJobs,
    getMyRecruiterProfile,
    updateRecruiterProfile,
    uploadCompanyLogo,
    uploadRecruiterImage,
    deleteRecruiterProfile,
    getRecruiterDashboard,
};
