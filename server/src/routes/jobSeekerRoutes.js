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
    getJobSeekerDashboard,
    getMySavedJobs,
    saveJobForSeeker,
    unsaveJobForSeeker,
} from "../controllers/jobSeeker.Controller.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

/* =========================================
   PUBLIC ROUTES
========================================= */

// Get all job seekers
router.get("/", asyncHandler(getAllJobSeekers));

// Get job seeker by ID
router.get("/:id", asyncHandler(getJobSeekerById));


/* =========================================
   PROTECTED ROUTES (JOB SEEKER)
========================================= */

// Get logged-in profile
router.get(
    "/me/profile",
    authMiddleware,
    roleMiddleware("jobseeker"),
    asyncHandler(getMyJobSeekerProfile)
);

// Dashboard summary
router.get(
    "/me/dashboard",
    authMiddleware,
    roleMiddleware("jobseeker"),
    asyncHandler(getJobSeekerDashboard)
);

router.get(
    "/me/saved-jobs",
    authMiddleware,
    roleMiddleware("jobseeker"),
    asyncHandler(getMySavedJobs)
);
router.post(
    "/me/saved-jobs",
    authMiddleware,
    roleMiddleware("jobseeker"),
    asyncHandler(saveJobForSeeker)
);
router.delete(
    "/me/saved-jobs/:jobId",
    authMiddleware,
    roleMiddleware("jobseeker"),
    asyncHandler(unsaveJobForSeeker)
);

// 🔥 UPDATE PROFILE (with avatar support)
router.put(
    "/profile",
    authMiddleware,
    roleMiddleware("jobseeker"),
    upload.single("avatar"),   // ✅ IMPORTANT
    asyncHandler(updateJobSeekerProfile)
);


// Upload resume
router.post(
    "/resume",
    authMiddleware,
    roleMiddleware("jobseeker"),
    upload.single("resume"),
    asyncHandler(uploadResume)
);


// 🔥 Upload avatar separately (optional)
router.post(
    "/avatar",
    authMiddleware,
    roleMiddleware("jobseeker"),
    upload.single("avatar"),
    asyncHandler(uploadAvatar)
);

/* =========================================
   CAREER: EXPERIENCE
========================================= */
router.get("/me/experience", authMiddleware, roleMiddleware("jobseeker"), asyncHandler(getExperience));
router.post("/me/experience", authMiddleware, roleMiddleware("jobseeker"), asyncHandler(addExperience));
router.put("/me/experience/:id", authMiddleware, roleMiddleware("jobseeker"), asyncHandler(updateExperience));
router.delete("/me/experience/:id", authMiddleware, roleMiddleware("jobseeker"), asyncHandler(deleteExperience));

/* =========================================
   CAREER: EDUCATION
========================================= */
router.get("/me/education", authMiddleware, roleMiddleware("jobseeker"), asyncHandler(getEducation));
router.post("/me/education", authMiddleware, roleMiddleware("jobseeker"), asyncHandler(addEducation));
router.put("/me/education/:id", authMiddleware, roleMiddleware("jobseeker"), asyncHandler(updateEducation));
router.delete("/me/education/:id", authMiddleware, roleMiddleware("jobseeker"), asyncHandler(deleteEducation));

export default router;