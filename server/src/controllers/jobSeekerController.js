import JobSeeker from "../models/JobSeeker.js";
import User from "../models/User.js";

// @desc    Get all job seekers for recruiters to browse
// @route   GET /api/jobseekers
// @access  Private/Public depending on implementation
const getAllJobSeekers = async (req, res) => {
    try {
        const jobSeekers = await JobSeeker.find().populate("user", "fullName email avatar location");

        res.status(200).json({
            success: true,
            jobSeekers,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error fetching job seekers",
            error: error.message,
        });
    }
};

// @desc    Get a single job seeker profile by ID
// @route   GET /api/jobseekers/:id
// @access  Private/Public depending on implementation
const getJobSeekerById = async (req, res) => {
    try {
        const { id } = req.params;

        const jobSeeker = await JobSeeker.findById(id).populate("user", "fullName email avatar location phone");

        if (!jobSeeker) {
            return res.status(404).json({
                success: false,
                message: "Job seeker profile not found",
            });
        }

        res.status(200).json({
            success: true,
            jobSeeker,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error fetching job seeker profile",
            error: error.message,
        });
    }
};

// @desc    Update job seeker detailed profile information
// @route   PUT /api/jobseekers/profile
// @access  Private (Job Seeker only)
const updateJobSeekerProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { jobTitle, skills, bio, linkedin, portfolio } = req.body;

        // Find the specific JobSeeker profile tied to the user
        let jobSeekerProfile = await JobSeeker.findOne({ user: userId });

        if (!jobSeekerProfile) {
            return res.status(404).json({
                success: false,
                message: "Job seeker profile not found for this user",
            });
        }

        // Update fields if they are provided
        if (jobTitle !== undefined) jobSeekerProfile.jobTitle = jobTitle;
        if (skills !== undefined) jobSeekerProfile.skills = skills;
        if (bio !== undefined) jobSeekerProfile.bio = bio;
        if (linkedin !== undefined) jobSeekerProfile.linkedin = linkedin;
        if (portfolio !== undefined) jobSeekerProfile.portfolio = portfolio;

        // Save the updated profile
        await jobSeekerProfile.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profile: jobSeekerProfile,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error updating job seeker profile",
            error: error.message,
        });
    }
};

// @desc    Upload or update the user's resume file
// @route   POST /api/jobseekers/resume
// @access  Private (Job Seeker only)
const uploadResume = async (req, res) => {
    try {
        const userId = req.user.id;

        // Ensure file was uploaded (multer places file in req.file)
        if (!req.file || !req.file.path) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid resume file",
            });
        }

        const resumeUrl = req.file.path;

        // Find the specific JobSeeker profile
        let jobSeekerProfile = await JobSeeker.findOne({ user: userId });

        if (!jobSeekerProfile) {
            return res.status(404).json({
                success: false,
                message: "Job seeker profile not found for this user",
            });
        }

        // Update the resumeUrl and save
        jobSeekerProfile.resumeUrl = resumeUrl;
        await jobSeekerProfile.save();

        res.status(200).json({
            success: true,
            message: "Resume uploaded successfully",
            resumeUrl,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error uploading resume",
            error: error.message,
        });
    }
};

export {
    getAllJobSeekers,
    getJobSeekerById,
    updateJobSeekerProfile,
    uploadResume
};
