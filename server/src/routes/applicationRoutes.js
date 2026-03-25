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
  removeApplicationByRecruiter,
} from "../controllers/application.Controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

// Job seeker
router.post(
  "/",
  authMiddleware,
  roleMiddleware("jobseeker"),
  upload.single("resume"),
  asyncHandler(applyToJob)
);
router.get("/me", authMiddleware, roleMiddleware("jobseeker"), asyncHandler(getMyApplications));
router.get("/my", authMiddleware, roleMiddleware("jobseeker"), asyncHandler(getMyApplicationsV2));

// Recruiter
router.get(
  "/recruiter",
  authMiddleware,
  roleMiddleware("recruiter"),
  asyncHandler(getRecruiterApplications),
);
router.get(
  "/job/:jobId",
  authMiddleware,
  roleMiddleware("recruiter"),
  asyncHandler(getJobApplications),
);
router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware("recruiter"),
  asyncHandler(updateApplicationStatus),
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("recruiter"),
  asyncHandler(removeApplicationByRecruiter),
);

export default router;
