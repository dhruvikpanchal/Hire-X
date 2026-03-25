import mongoose from "mongoose";
import JobSeeker from "../models/JobSeeker.js";
import User from "../models/User.js";
import Application from "../models/Application.js";
import SavedJob from "../models/SavedJob.js";
import JobAlert from "../models/JobAlert.js";
import Job from "../models/Job.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse, sendResponse } from "../utils/ApiResponse.js";

/* =========================================================
   GET MY PROFILE
   GET /api/jobseekers/me
========================================================= */
const getMyJobSeekerProfile = async (req, res) => {
    const userId = req.user.id;

    const profile = await JobSeeker.findOne({ user: userId })
        .populate("user", "fullName email avatar location phone");

    if (!profile) {
        throw new ApiError(404, "Profile not found");
    }

    return sendResponse(res, new ApiResponse(200, { profile }));
};


/* =========================================================
   UPDATE PROFILE
   PUT /api/jobseekers/profile
========================================================= */
const updateJobSeekerProfile = async (req, res) => {
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
        throw new ApiError(404, "User not found");
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
        throw new ApiError(404, "Job seeker profile not found");
    }

    // 🔥 FIX 4: SAFE UPDATE
    if (jobTitle !== undefined) profile.jobTitle = jobTitle;
    if (skills !== undefined) profile.skills = skills;
    if (bio !== undefined) profile.bio = bio;
    if (linkedin !== undefined) profile.linkedin = linkedin;
    if (portfolio !== undefined) profile.portfolio = portfolio;

    await profile.save();

    return sendResponse(res, new ApiResponse(200, {
        message: "Profile updated successfully",
        profile,
    }));
};
/* =========================================================
   UPLOAD RESUME
   POST /api/jobseekers/resume
========================================================= */
const uploadResume = async (req, res) => {
    const userId = req.user.id;

    if (!req.file) {
        throw new ApiError(400, "Please upload a resume file");
    }

    const profile = await JobSeeker.findOne({ user: userId });

    if (!profile) {
        throw new ApiError(404, "Job seeker profile not found");
    }

    profile.resumeUrl = `/uploads/job_seekers/resumes/${req.file.filename}`;

    await profile.save();

    return sendResponse(res, new ApiResponse(200, {
        message: "Resume uploaded successfully",
        resumeUrl: profile.resumeUrl,
    }));
};


/* =========================================================
   UPLOAD AVATAR (NEW 🔥)
   POST /api/jobseekers/avatar
========================================================= */
const uploadAvatar = async (req, res) => {
    const userId = req.user.id;

    if (!req.file) {
        throw new ApiError(400, "Please upload an image");
    }

    const user = await User.findById(userId);

    user.avatar = `/uploads/job_seekers/avatars/${req.file.filename}`;
    await user.save();

    return sendResponse(res, new ApiResponse(200, {
        message: "Avatar uploaded successfully",
        avatar: user.avatar,
    }));
};

/* =========================================================
   SEARCH CANDIDATES (RECRUITERS ONLY)
   GET /api/recruiters/candidates?q=&location=&jobTitle=&skills=
========================================================= */
const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const searchCandidatesForRecruiters = async (req, res) => {
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

    return sendResponse(res, new ApiResponse(200, {
        count: candidates.length,
        candidates,
    }));
};

/* =========================================================
   GET ALL JOB SEEKERS
========================================================= */
const getAllJobSeekers = async (req, res) => {
    const jobSeekers = await JobSeeker.find()
        .populate("user", "fullName email avatar location phone");

    return sendResponse(res, new ApiResponse(200, {
        count: jobSeekers.length,
        jobSeekers,
    }));
};


/* =========================================================
   GET JOB SEEKER BY ID
========================================================= */
const getJobSeekerById = async (req, res) => {
    const { id } = req.params;

    const jobSeeker = await JobSeeker.findById(id)
        .populate("user", "fullName email avatar location phone");

    if (!jobSeeker) {
        throw new ApiError(404, "Job seeker not found");
    }

    return sendResponse(res, new ApiResponse(200, { jobSeeker }));
};

/* =========================================================
   EXPERIENCE CRUD
========================================================= */
const getExperience = async (req, res) => {
    const profile = await JobSeeker.findOne({ user: req.user.id });
    if (!profile) throw new ApiError(404, "Profile not found");
    return sendResponse(res, new ApiResponse(200, { experience: profile.experience || [] }));
};

const addExperience = async (req, res) => {
    const profile = await JobSeeker.findOne({ user: req.user.id });
    if (!profile) throw new ApiError(404, "Profile not found");
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
    return sendResponse(res, new ApiResponse(201, { experience: profile.experience }));
};

const updateExperience = async (req, res) => {
    const profile = await JobSeeker.findOne({ user: req.user.id });
    if (!profile) throw new ApiError(404, "Profile not found");
    const { id } = req.params;
    const { jobRole, companyName, startDate, endDate, currentlyWorking, description } = req.body;
    const entry = profile.experience.id(id);
    if (!entry) throw new ApiError(404, "Experience not found");
    if (jobRole !== undefined) entry.jobRole = jobRole;
    if (companyName !== undefined) entry.companyName = companyName;
    if (startDate !== undefined) entry.startDate = startDate;
    if (endDate !== undefined) entry.endDate = endDate;
    if (currentlyWorking !== undefined) entry.currentlyWorking = !!currentlyWorking;
    if (description !== undefined) entry.description = description;
    await profile.save();
    return sendResponse(res, new ApiResponse(200, { experience: profile.experience }));
};

const deleteExperience = async (req, res) => {
    const profile = await JobSeeker.findOne({ user: req.user.id });
    if (!profile) throw new ApiError(404, "Profile not found");
    const { id } = req.params;
    profile.experience.pull(id);
    await profile.save();
    return sendResponse(res, new ApiResponse(200, { experience: profile.experience }));
};

/* =========================================================
   EDUCATION CRUD
========================================================= */
const getEducation = async (req, res) => {
    const profile = await JobSeeker.findOne({ user: req.user.id });
    if (!profile) throw new ApiError(404, "Profile not found");
    return sendResponse(res, new ApiResponse(200, { education: profile.education || [] }));
};

const addEducation = async (req, res) => {
    const profile = await JobSeeker.findOne({ user: req.user.id });
    if (!profile) throw new ApiError(404, "Profile not found");
    const { degree, institution, startYear, endYear } = req.body;
    profile.education.push({
        degree: degree || "",
        institution: institution || "",
        startYear: startYear || "",
        endYear: endYear || ""
    });
    await profile.save();
    return sendResponse(res, new ApiResponse(201, { education: profile.education }));
};

const updateEducation = async (req, res) => {
    const profile = await JobSeeker.findOne({ user: req.user.id });
    if (!profile) throw new ApiError(404, "Profile not found");
    const { id } = req.params;
    const { degree, institution, startYear, endYear } = req.body;
    const entry = profile.education.id(id);
    if (!entry) throw new ApiError(404, "Education not found");
    if (degree !== undefined) entry.degree = degree;
    if (institution !== undefined) entry.institution = institution;
    if (startYear !== undefined) entry.startYear = startYear;
    if (endYear !== undefined) entry.endYear = endYear;
    await profile.save();
    return sendResponse(res, new ApiResponse(200, { education: profile.education }));
};

const deleteEducation = async (req, res) => {
    const profile = await JobSeeker.findOne({ user: req.user.id });
    if (!profile) throw new ApiError(404, "Profile not found");
    const { id } = req.params;
    profile.education.pull(id);
    await profile.save();
    return sendResponse(res, new ApiResponse(200, { education: profile.education }));
};

/* =========================================================
   DASHBOARD SUMMARY (Job Seeker)
   GET /api/jobseekers/me/dashboard
========================================================= */
const getJobSeekerDashboard = async (req, res) => {
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

    return sendResponse(res, new ApiResponse(200, {
        profile: profile || null,
        stats: {
            applications: applicationsCount,
            savedJobs: savedJobsCount,
            activeAlerts: activeAlertsCount,
            profileCompletion,
        },
        recentApplications,
    }));
};

/* =========================================================
   SAVED JOBS
   GET  /api/jobseekers/me/saved-jobs
   POST /api/jobseekers/me/saved-jobs   body: { jobId }
   DELETE /api/jobseekers/me/saved-jobs/:jobId
========================================================= */
const getMySavedJobs = async (req, res) => {
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

    return sendResponse(res, new ApiResponse(200, { savedJobs }));
};

const saveJobForSeeker = async (req, res) => {
    const userId = req.user.id;
    const { jobId } = req.body;

    if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
        throw new ApiError(400, "Valid jobId is required");
    }

    const job = await Job.findById(jobId).lean();
    if (!job || job.status !== "active") {
        throw new ApiError(404, "Job not found or no longer available");
    }

    try {
        await SavedJob.create({ seeker: userId, job: jobId });
    } catch (e) {
        if (e?.code === 11000) {
            throw new ApiError(400, "This job is already in your saved list");
        }
        throw e;
    }

    return sendResponse(res, new ApiResponse(201, { message: "Job saved" }));
};

const unsaveJobForSeeker = async (req, res) => {
    const userId = req.user.id;
    const { jobId } = req.params;

    if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
        throw new ApiError(400, "Valid job id is required");
    }

    await SavedJob.deleteOne({ seeker: userId, job: jobId });

    return sendResponse(res, new ApiResponse(200, { message: "Removed from saved jobs" }));
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
