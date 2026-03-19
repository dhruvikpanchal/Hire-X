import Recruiter from "../models/Recruiter.js";
import User from "../models/User.js";
import Job from "../models/Job.js";
import mongoose from "mongoose";
import Application from "../models/Application.js";


/*
------------------------------------------------
@desc    Get all recruiters
@route   GET /api/recruiters
@access  Public
------------------------------------------------
*/
const getAllRecruiters = async (req, res) => {
    try {

        const recruiters = await Recruiter.find()
            .populate("user", "fullName email avatar location phone")
            .lean();

        res.status(200).json({
            success: true,
            recruiters,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server Error fetching recruiters",
            error: error.message,
        });

    }
};


/*
------------------------------------------------
@desc    Get recruiter by ID
@route   GET /api/recruiters/:id
@access  Public
------------------------------------------------
*/
const getRecruiterById = async (req, res) => {
    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid recruiter ID",
            });
        }

        const recruiter = await Recruiter.findById(id)
            .populate("user", "fullName email avatar location phone")
            .lean();

        if (!recruiter) {
            return res.status(404).json({
                success: false,
                message: "Recruiter profile not found",
            });
        }

        res.status(200).json({
            success: true,
            recruiter,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server Error fetching recruiter profile",
            error: error.message,
        });

    }
};

/*
------------------------------------------------
@desc    Get recruiter (company) with active jobs
@route   GET /api/recruiters/:id/jobs
@access  Public
------------------------------------------------
*/
const getRecruiterWithJobs = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid recruiter ID",
            });
        }

        const recruiter = await Recruiter.findById(id)
            .populate("user", "fullName email avatar location phone")
            .lean();

        if (!recruiter) {
            return res.status(404).json({
                success: false,
                message: "Recruiter profile not found",
            });
        }

        // Jobs are stored by recruiter USER id
        const jobs = await Job.find({
            recruiter: recruiter.user?._id,
            $or: [{ status: "active" }, { isActive: true }],
        })
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            success: true,
            recruiter,
            jobs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error fetching company jobs",
            error: error.message,
        });
    }
};


/*
------------------------------------------------
@desc    Get logged-in recruiter profile
@route   GET /api/recruiters/profile/me
@access  Private
------------------------------------------------
*/
const getMyRecruiterProfile = async (req, res) => {
    try {

        const userId = req.user.id;

        const recruiter = await Recruiter.findOne({ user: userId })
            .populate("user", "fullName email avatar location phone")
            .lean();

        if (!recruiter) {
            return res.status(404).json({
                success: false,
                message: "Recruiter profile not found",
            });
        }

        res.status(200).json({
            success: true,
            recruiter,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server Error fetching recruiter profile",
            error: error.message,
        });

    }
};


/*
------------------------------------------------
@desc    Update recruiter profile + user info
@route   PUT /api/recruiters/profile
@access  Private
------------------------------------------------
*/
const updateRecruiterProfile = async (req, res) => {
    try {

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

        // update USER info
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.fullName = recruiterName ?? user.fullName;
        user.phone = phone ?? user.phone;
        user.location = location ?? user.location;

        await user.save();


        // update RECRUITER info
        const recruiter = await Recruiter.findOne({ user: userId });

        if (!recruiter) {
            return res.status(404).json({
                success: false,
                message: "Recruiter profile not found",
            });
        }

        recruiter.jobTitle = jobTitle ?? recruiter.jobTitle;
        recruiter.companyName = companyName ?? recruiter.companyName;
        recruiter.industry = industry ?? recruiter.industry;
        recruiter.companySize = companySize ?? recruiter.companySize;
        recruiter.companyWebsite = companyWebsite ?? recruiter.companyWebsite;
        recruiter.companyDescription =
            companyDescription ?? recruiter.companyDescription;

        await recruiter.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            recruiter,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server Error updating profile",
            error: error.message,
        });

    }
};


/*
------------------------------------------------
@desc    Upload company logo
@route   POST /api/recruiters/company-logo
@access  Private
------------------------------------------------
*/
const uploadCompanyLogo = async (req, res) => {
    try {

        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a company logo",
            });
        }

        const recruiter = await Recruiter.findOne({ user: userId });

        if (!recruiter) {
            return res.status(404).json({
                success: false,
                message: "Recruiter profile not found",
            });
        }

        const logoPath = `/uploads/recruiter/company_logos/${req.file.filename}`;

        recruiter.companyLogo = logoPath;

        await recruiter.save();

        res.status(200).json({
            success: true,
            message: "Company logo uploaded successfully",
            companyLogo: logoPath,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server Error uploading company logo",
            error: error.message,
        });

    }
};


/*
------------------------------------------------
@desc    Upload recruiter avatar
@route   POST /api/recruiters/profile-image
@access  Private
------------------------------------------------
*/
const uploadRecruiterImage = async (req, res) => {
    try {

        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized user",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload an image",
            });
        }

        const avatarPath = `/uploads/recruiter/profile_images/${req.file.filename}`;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { avatar: avatarPath },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile image uploaded successfully",
            avatar: updatedUser.avatar,
        });

    } catch (error) {

        console.error("Upload recruiter image error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error uploading profile image",
            error: error.message,
        });

    }
};


/*
------------------------------------------------
@desc    Delete recruiter profile
@route   DELETE /api/recruiters/profile
@access  Private
------------------------------------------------
*/
const deleteRecruiterProfile = async (req, res) => {
    try {

        const userId = req.user.id;

        const recruiter = await Recruiter.findOneAndDelete({ user: userId });

        if (!recruiter) {
            return res.status(404).json({
                success: false,
                message: "Recruiter profile not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Recruiter profile deleted successfully",
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server Error deleting recruiter profile",
            error: error.message,
        });

    }
};

/*
------------------------------------------------
@desc    Recruiter dashboard summary
@route   GET /api/recruiters/me/dashboard
@access  Private (Recruiter)
------------------------------------------------
*/
const getRecruiterDashboard = async (req, res) => {
    try {
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

        return res.status(200).json({
            success: true,
            recruiter: recruiter || null,
            stats: {
                jobsPosted,
                activeJobs,
                totalApplications,
                pendingApplications,
            },
            recentJobs,
            recentApplications,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error fetching recruiter dashboard",
            error: error.message,
        });
    }
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