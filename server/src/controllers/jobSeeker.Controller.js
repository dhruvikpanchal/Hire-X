import mongoose from "mongoose";
import JobSeeker from "../models/JobSeeker.js";
import User from "../models/User.js";
import Application from "../models/Application.js";
import SavedJob from "../models/SavedJob.js";
import JobAlert from "../models/JobAlert.js";
import Job from "../models/Job.js";

/* =========================================================
   GET MY PROFILE
   GET /api/jobseekers/me
========================================================= */
const getMyJobSeekerProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const profile = await JobSeeker.findOne({ user: userId })
            .populate("user", "fullName email avatar location phone");

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        res.status(200).json({
            success: true,
            profile,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error fetching profile",
            error: error.message,
        });
    }
};


/* =========================================================
   UPDATE PROFILE
   PUT /api/jobseekers/profile
========================================================= */
const updateJobSeekerProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        
        if (process.env.NODE_ENV !== "production") {
            console.log("[updateJobSeekerProfile] content-type:", req.headers["content-type"]);
            console.log("[updateJobSeekerProfile] user:", req.user);
            console.log("[updateJobSeekerProfile] body:", req.body);
            console.log("[updateJobSeekerProfile] file:", req.file ? {
                fieldname: req.file.fieldname,
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                filename: req.file.filename
            } : null);
        }

        let {
            fullName,
            email,
            phone,
            location,
            jobTitle,
            skills,
            bio,
            linkedin,
            portfolio,
        } = req.body;

        /* 🔥 FIX 1: CLEAN VALUES */
        const clean = (val) => {
            if (val === undefined || val === null) return undefined;
            if (typeof val === "string") {
                const t = val.trim();
                if (t === "" || t === "undefined" || t === "null") return undefined;
                return t;
            }
            return val;
        };

        fullName = clean(fullName);
        email = clean(email);
        phone = clean(phone);
        location = clean(location);
        jobTitle = clean(jobTitle);
        bio = clean(bio);
        linkedin = clean(linkedin);
        portfolio = clean(portfolio);

        /* 🔥 FIX 2: skills handling (IMPORTANT) */
        if (typeof skills === "string") {
            try {
                skills = JSON.parse(skills); // correct way
            } catch (err) {
                skills = skills.split(",").map(s => s.trim());
            }
        }

        /* -------- UPDATE USER -------- */
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // 🔥 FIX 3: SAFE UPDATE (NO ??)
        if (fullName !== undefined) user.fullName = fullName;
        if (email !== undefined) user.email = email;
        if (phone !== undefined) user.phone = phone;
        if (location !== undefined) user.location = location;

        /* Avatar Upload */
        if (req.file && req.file.fieldname === "avatar") {
            user.avatar = `/uploads/job_seekers/avatars/${req.file.filename}`;
        }

        await user.save();

        /* -------- UPDATE JOB SEEKER -------- */
        const profile = await JobSeeker.findOne({ user: userId });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Job seeker profile not found",
            });
        }

        // 🔥 FIX 4: SAFE UPDATE
        if (jobTitle !== undefined) profile.jobTitle = jobTitle;
        if (skills !== undefined) profile.skills = skills;
        if (bio !== undefined) profile.bio = bio;
        if (linkedin !== undefined) profile.linkedin = linkedin;
        if (portfolio !== undefined) profile.portfolio = portfolio;

        await profile.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profile,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error updating profile",
            error: error.message,
        });
    }
};
/* =========================================================
   UPLOAD RESUME
   POST /api/jobseekers/resume
========================================================= */
const uploadResume = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a resume file",
            });
        }

        const profile = await JobSeeker.findOne({ user: userId });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Job seeker profile not found",
            });
        }

        profile.resumeUrl = `/uploads/job_seekers/resumes/${req.file.filename}`;

        await profile.save();

        res.status(200).json({
            success: true,
            message: "Resume uploaded successfully",
            resumeUrl: profile.resumeUrl,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error uploading resume",
            error: error.message,
        });
    }
};


/* =========================================================
   UPLOAD AVATAR (NEW 🔥)
   POST /api/jobseekers/avatar
========================================================= */
const uploadAvatar = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload an image",
            });
        }

        const user = await User.findById(userId);

        user.avatar = `/uploads/job_seekers/avatars/${req.file.filename}`;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Avatar uploaded successfully",
            avatar: user.avatar,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error uploading avatar",
            error: error.message,
        });
    }
};

/* =========================================================
   SEARCH CANDIDATES (RECRUITERS ONLY)
   GET /api/recruiters/candidates?q=&location=&jobTitle=&skills=
========================================================= */
const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const searchCandidatesForRecruiters = async (req, res) => {
    try {
        const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
        const location =
            typeof req.query.location === "string" ? req.query.location.trim() : "";
        const jobTitle =
            typeof req.query.jobTitle === "string" ? req.query.jobTitle.trim() : "";
        const skillsParam =
            typeof req.query.skills === "string" ? req.query.skills.trim() : "";

        const and = [];

        if (jobTitle) {
            and.push({ jobTitle: new RegExp(escapeRegex(jobTitle), "i") });
        }

        if (location) {
            const users = await User.find({
                role: "jobseeker",
                location: new RegExp(escapeRegex(location), "i"),
            })
                .select("_id")
                .lean();
            and.push({ user: { $in: users.map((u) => u._id) } });
        }

        if (skillsParam) {
            const parts = skillsParam
                .split(/[,;/|]+/)
                .map((s) => s.trim())
                .filter(Boolean);
            if (parts.length) {
                and.push({
                    $or: parts.map((s) => ({
                        skills: new RegExp(escapeRegex(s), "i"),
                    })),
                });
            }
        }

        if (q) {
            const r = new RegExp(escapeRegex(q), "i");
            const qUsers = await User.find({
                role: "jobseeker",
                $or: [{ fullName: r }, { email: r }],
            })
                .select("_id")
                .lean();
            const userIdsFromName = qUsers.map((u) => u._id);
            and.push({
                $or: [
                    { jobTitle: r },
                    { bio: r },
                    { skills: r },
                    ...(userIdsFromName.length
                        ? [{ user: { $in: userIdsFromName } }]
                        : []),
                ],
            });
        }

        const filter = and.length ? { $and: and } : {};

        const candidates = await JobSeeker.find(filter)
            .populate("user", "fullName email avatar location phone role")
            .sort({ updatedAt: -1 })
            .lean();

        res.status(200).json({
            success: true,
            count: candidates.length,
            candidates,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error searching candidates",
            error: error.message,
        });
    }
};

/* =========================================================
   GET ALL JOB SEEKERS
========================================================= */
const getAllJobSeekers = async (req, res) => {
    try {
        const jobSeekers = await JobSeeker.find()
            .populate("user", "fullName email avatar location phone");

        res.status(200).json({
            success: true,
            count: jobSeekers.length,
            jobSeekers,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error fetching job seekers",
            error: error.message,
        });
    }
};


/* =========================================================
   GET JOB SEEKER BY ID
========================================================= */
const getJobSeekerById = async (req, res) => {
    try {
        const { id } = req.params;

        const jobSeeker = await JobSeeker.findById(id)
            .populate("user", "fullName email avatar location phone");

        if (!jobSeeker) {
            return res.status(404).json({
                success: false,
                message: "Job seeker not found",
            });
        }

        res.status(200).json({
            success: true,
            jobSeeker,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error fetching job seeker",
            error: error.message,
        });
    }
};

/* =========================================================
   EXPERIENCE CRUD
========================================================= */
const getExperience = async (req, res) => {
    try {
        const profile = await JobSeeker.findOne({ user: req.user.id });
        if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });
        res.status(200).json({ success: true, experience: profile.experience || [] });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const addExperience = async (req, res) => {
    try {
        const profile = await JobSeeker.findOne({ user: req.user.id });
        if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });
        const { jobRole, companyName, startDate, endDate, currentlyWorking, description } = req.body;
        profile.experience.push({
            jobRole: jobRole || "",
            companyName: companyName || "",
            startDate: startDate || "",
            endDate: endDate || "",
            currentlyWorking: !!currentlyWorking,
            description: description || ""
        });
        await profile.save();
        res.status(201).json({ success: true, experience: profile.experience });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const updateExperience = async (req, res) => {
    try {
        const profile = await JobSeeker.findOne({ user: req.user.id });
        if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });
        const { id } = req.params;
        const { jobRole, companyName, startDate, endDate, currentlyWorking, description } = req.body;
        const entry = profile.experience.id(id);
        if (!entry) return res.status(404).json({ success: false, message: "Experience not found" });
        if (jobRole !== undefined) entry.jobRole = jobRole;
        if (companyName !== undefined) entry.companyName = companyName;
        if (startDate !== undefined) entry.startDate = startDate;
        if (endDate !== undefined) entry.endDate = endDate;
        if (currentlyWorking !== undefined) entry.currentlyWorking = !!currentlyWorking;
        if (description !== undefined) entry.description = description;
        await profile.save();
        res.status(200).json({ success: true, experience: profile.experience });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const deleteExperience = async (req, res) => {
    try {
        const profile = await JobSeeker.findOne({ user: req.user.id });
        if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });
        const { id } = req.params;
        profile.experience.pull(id);
        await profile.save();
        res.status(200).json({ success: true, experience: profile.experience });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

/* =========================================================
   EDUCATION CRUD
========================================================= */
const getEducation = async (req, res) => {
    try {
        const profile = await JobSeeker.findOne({ user: req.user.id });
        if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });
        res.status(200).json({ success: true, education: profile.education || [] });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const addEducation = async (req, res) => {
    try {
        const profile = await JobSeeker.findOne({ user: req.user.id });
        if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });
        const { degree, institution, startYear, endYear } = req.body;
        profile.education.push({
            degree: degree || "",
            institution: institution || "",
            startYear: startYear || "",
            endYear: endYear || ""
        });
        await profile.save();
        res.status(201).json({ success: true, education: profile.education });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const updateEducation = async (req, res) => {
    try {
        const profile = await JobSeeker.findOne({ user: req.user.id });
        if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });
        const { id } = req.params;
        const { degree, institution, startYear, endYear } = req.body;
        const entry = profile.education.id(id);
        if (!entry) return res.status(404).json({ success: false, message: "Education not found" });
        if (degree !== undefined) entry.degree = degree;
        if (institution !== undefined) entry.institution = institution;
        if (startYear !== undefined) entry.startYear = startYear;
        if (endYear !== undefined) entry.endYear = endYear;
        await profile.save();
        res.status(200).json({ success: true, education: profile.education });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const deleteEducation = async (req, res) => {
    try {
        const profile = await JobSeeker.findOne({ user: req.user.id });
        if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });
        const { id } = req.params;
        profile.education.pull(id);
        await profile.save();
        res.status(200).json({ success: true, education: profile.education });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

/* =========================================================
   DASHBOARD SUMMARY (Job Seeker)
   GET /api/jobseekers/me/dashboard
========================================================= */
const getJobSeekerDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        const profile = await JobSeeker.findOne({ user: userId }).populate(
            "user",
            "fullName email avatar location phone"
        );

        // Stats
        const [applicationsCount, savedJobsCount, activeAlertsCount] = await Promise.all([
            Application.countDocuments({ seeker: userId }),
            SavedJob.countDocuments({ seeker: userId }),
            JobAlert.countDocuments({ seeker: userId, isActive: true }),
        ]);

        // Recent applications
        const recentApplications = await Application.find({ seeker: userId })
            .populate({
                path: "job",
                select: "jobTitle company location jobType salaryMin salaryMax createdAt",
            })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        // Profile completion (simple heuristic)
        const user = profile?.user;
        const filled = [
            user?.fullName,
            user?.email,
            user?.location,
            user?.phone,
            user?.avatar,
            profile?.jobTitle,
            profile?.bio,
            Array.isArray(profile?.skills) && profile.skills.length ? "skills" : "",
            profile?.resumeUrl,
            profile?.linkedin,
            profile?.portfolio,
            Array.isArray(profile?.education) && profile.education.length ? "education" : "",
        ].filter(Boolean).length;

        const total = 12;
        const profileCompletion = Math.min(100, Math.round((filled / total) * 100));

        return res.status(200).json({
            success: true,
            profile: profile || null,
            stats: {
                applications: applicationsCount,
                savedJobs: savedJobsCount,
                activeAlerts: activeAlertsCount,
                profileCompletion,
            },
            recentApplications,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error fetching dashboard data",
            error: error.message,
        });
    }
};

/* =========================================================
   SAVED JOBS
   GET  /api/jobseekers/me/saved-jobs
   POST /api/jobseekers/me/saved-jobs   body: { jobId }
   DELETE /api/jobseekers/me/saved-jobs/:jobId
========================================================= */
const getMySavedJobs = async (req, res) => {
    try {
        const userId = req.user.id;

        const rows = await SavedJob.find({ seeker: userId })
            .populate({
                path: "job",
                select: "jobTitle company location jobType salaryMin salaryMax createdAt status skills description",
            })
            .sort({ updatedAt: -1 })
            .lean();

        const savedJobs = (rows || [])
            .filter((r) => r.job)
            .map((r) => ({
                _id: r._id,
                savedAt: r.createdAt,
                job: r.job,
            }));

        return res.status(200).json({ success: true, savedJobs });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error fetching saved jobs",
            error: error.message,
        });
    }
};

const saveJobForSeeker = async (req, res) => {
    try {
        const userId = req.user.id;
        const { jobId } = req.body;

        if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ success: false, message: "Valid jobId is required" });
        }

        const job = await Job.findById(jobId).lean();
        if (!job || job.status !== "active") {
            return res.status(404).json({ success: false, message: "Job not found or no longer available" });
        }

        try {
            await SavedJob.create({ seeker: userId, job: jobId });
        } catch (e) {
            if (e?.code === 11000) {
                return res.status(400).json({ success: false, message: "This job is already in your saved list" });
            }
            throw e;
        }

        return res.status(201).json({ success: true, message: "Job saved" });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error saving job",
            error: error.message,
        });
    }
};

const unsaveJobForSeeker = async (req, res) => {
    try {
        const userId = req.user.id;
        const { jobId } = req.params;

        if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ success: false, message: "Valid job id is required" });
        }

        await SavedJob.deleteOne({ seeker: userId, job: jobId });

        return res.status(200).json({ success: true, message: "Removed from saved jobs" });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error removing saved job",
            error: error.message,
        });
    }
};

export {
    getMyJobSeekerProfile,
    updateJobSeekerProfile,
    uploadResume,
    uploadAvatar,
    searchCandidatesForRecruiters,
    getAllJobSeekers,
    getJobSeekerById,
    getExperience,
    addExperience,
    updateExperience,
    deleteExperience,
    getEducation,
    addEducation,
    updateEducation,
    deleteEducation,
    getJobSeekerDashboard,
    getMySavedJobs,
    saveJobForSeeker,
    unsaveJobForSeeker,
};