import express from "express";
import {
    getAllJobSeekers,
    getJobSeekerById,
    updateJobSeekerProfile,
    uploadResume
} from "../controllers/jobSeekerController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/", getAllJobSeekers);
router.get("/:id", getJobSeekerById);

// Protected routes (Job Seekers only)
router.put(
    "/profile",
    authMiddleware,
    roleMiddleware("jobseeker"),
    updateJobSeekerProfile
);

router.post(
    "/resume",
    authMiddleware,
    roleMiddleware("jobseeker"),
    upload.single("resume"),
    uploadResume
);

export default router;
