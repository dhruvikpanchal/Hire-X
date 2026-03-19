import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import {
  applyToJob,
  getMyApplications,
  getMyApplicationsV2,
  getJobApplications,
  getRecruiterApplications,
  updateApplicationStatus,
} from "../controllers/application.Controller.js";

const router = express.Router();

// Job seeker
router.post(
  "/",
  authMiddleware,
  roleMiddleware("jobseeker"),
  upload.single("resume"),
  applyToJob
);
router.get("/me", authMiddleware, roleMiddleware("jobseeker"), getMyApplications);
router.get("/my", authMiddleware, roleMiddleware("jobseeker"), getMyApplicationsV2);

// Recruiter
router.get(
  "/recruiter",
  authMiddleware,
  roleMiddleware("recruiter"),
  getRecruiterApplications,
);
router.get(
  "/job/:jobId",
  authMiddleware,
  roleMiddleware("recruiter"),
  getJobApplications,
);
router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware("recruiter"),
  updateApplicationStatus,
);

export default router;
