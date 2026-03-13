import Recruiter from "../models/Recruiter.js";
import User from "../models/User.js";

// @desc    Get all recruiters and companies
// @route   GET /api/recruiters
// @access  Private/Public depending on implementation
const getAllRecruiters = async (req, res) => {
    try {
        const recruiters = await Recruiter.find().populate("user", "fullName email avatar location");

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

// @desc    Get a single recruiter profile by ID
// @route   GET /api/recruiters/:id
// @access  Private/Public depending on implementation
const getRecruiterById = async (req, res) => {
    try {
        const { id } = req.params;

        const recruiter = await Recruiter.findById(id).populate("user", "fullName email avatar location phone");

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

// @desc    Update recruiter and company information
// @route   PUT /api/recruiters/profile
// @access  Private (Employer only)
const updateRecruiterProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { 
            jobTitle, 
            companyName, 
            industry, 
            companySize, 
            companyWebsite, 
            companyDescription 
        } = req.body;

        // Find the specific Recruiter profile tied to the user
        let recruiterProfile = await Recruiter.findOne({ user: userId });

        if (!recruiterProfile) {
            return res.status(404).json({
                success: false,
                message: "Recruiter profile not found for this user",
            });
        }

        // Update fields if they are provided
        if (jobTitle !== undefined) recruiterProfile.jobTitle = jobTitle;
        if (companyName !== undefined) recruiterProfile.companyName = companyName;
        if (industry !== undefined) recruiterProfile.industry = industry;
        if (companySize !== undefined) recruiterProfile.companySize = companySize;
        if (companyWebsite !== undefined) recruiterProfile.companyWebsite = companyWebsite;
        if (companyDescription !== undefined) recruiterProfile.companyDescription = companyDescription;

        // Save the updated profile
        await recruiterProfile.save();

        res.status(200).json({
            success: true,
            message: "Recruiter profile updated successfully",
            recruiter: recruiterProfile,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error updating recruiter profile",
            error: error.message,
        });
    }
};

// @desc    Upload or update company logo
// @route   POST /api/recruiters/company-logo
// @access  Private (Employer only)
const uploadCompanyLogo = async (req, res) => {
    try {
        const userId = req.user.id;

        // Ensure file was uploaded (multer places file in req.file)
        if (!req.file || !req.file.path) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid company logo image",
            });
        }

        const companyLogoPath = req.file.path;

        // Find the specific Recruiter profile
        let recruiterProfile = await Recruiter.findOne({ user: userId });

        if (!recruiterProfile) {
            return res.status(404).json({
                success: false,
                message: "Recruiter profile not found for this user",
            });
        }

        // Update the companyLogo and save
        recruiterProfile.companyLogo = companyLogoPath;
        await recruiterProfile.save();

        res.status(200).json({
            success: true,
            message: "Company logo uploaded successfully",
            companyLogo: companyLogoPath,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error uploading company logo",
            error: error.message,
        });
    }
};

export {
    getAllRecruiters,
    getRecruiterById,
    updateRecruiterProfile,
    uploadCompanyLogo
};
