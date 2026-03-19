import express from "express";
import {
    getAllJobSeekers,
    getJobSeekerById,
    getMyJobSeekerProfile,
    updateJobSeekerProfile,
    uploadResume,
    uploadAvatar,
    getExperience,
    addExperience,
    updateExperience,
    deleteExperience,
    getEducation,
    addEducation,
    updateEducation,
    deleteEducation,
    getJobSeekerDashboard
} from "../controllers/jobSeeker.Controller.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

/* =========================================
   PUBLIC ROUTES
========================================= */

// Get all job seekers
router.get("/", getAllJobSeekers);

// Get job seeker by ID
router.get("/:id", getJobSeekerById);


/* =========================================
   PROTECTED ROUTES (JOB SEEKER)
========================================= */

// Get logged-in profile
router.get(
    "/me/profile",
    authMiddleware,
    roleMiddleware("jobseeker"),
    getMyJobSeekerProfile
);

// Dashboard summary
router.get(
    "/me/dashboard",
    authMiddleware,
    roleMiddleware("jobseeker"),
    getJobSeekerDashboard
);


// 🔥 UPDATE PROFILE (with avatar support)
router.put(
    "/profile",
    authMiddleware,
    roleMiddleware("jobseeker"),
    upload.single("avatar"),   // ✅ IMPORTANT
    updateJobSeekerProfile
);


// Upload resume
router.post(
    "/resume",
    authMiddleware,
    roleMiddleware("jobseeker"),
    upload.single("resume"),
    uploadResume
);


// 🔥 Upload avatar separately (optional)
router.post(
    "/avatar",
    authMiddleware,
    roleMiddleware("jobseeker"),
    upload.single("avatar"),
    uploadAvatar
);

/* =========================================
   CAREER: EXPERIENCE
========================================= */
router.get("/me/experience", authMiddleware, roleMiddleware("jobseeker"), getExperience);
router.post("/me/experience", authMiddleware, roleMiddleware("jobseeker"), addExperience);
router.put("/me/experience/:id", authMiddleware, roleMiddleware("jobseeker"), updateExperience);
router.delete("/me/experience/:id", authMiddleware, roleMiddleware("jobseeker"), deleteExperience);

/* =========================================
   CAREER: EDUCATION
========================================= */
router.get("/me/education", authMiddleware, roleMiddleware("jobseeker"), getEducation);
router.post("/me/education", authMiddleware, roleMiddleware("jobseeker"), addEducation);
router.put("/me/education/:id", authMiddleware, roleMiddleware("jobseeker"), updateEducation);
router.delete("/me/education/:id", authMiddleware, roleMiddleware("jobseeker"), deleteEducation);

export default router;