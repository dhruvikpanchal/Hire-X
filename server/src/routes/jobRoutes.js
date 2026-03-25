import express from "express";
import {
   createJob,
   getAllJobs,
   getJobById,
   getMyJobs,
   updateJob,
   deleteJob
} from "../controllers/job.Controller.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

/* ==================================================
   Public Routes
================================================== */

router.get("/", asyncHandler(getAllJobs));


/* ==================================================
   Recruiter Protected Routes
================================================== */

router.get("/my-jobs", authMiddleware, asyncHandler(getMyJobs));

router.post("/", authMiddleware, asyncHandler(createJob));

router.put("/:id", authMiddleware, asyncHandler(updateJob));

router.delete("/:id", authMiddleware, asyncHandler(deleteJob));


/* ==================================================
   Dynamic Route (KEEP LAST)
================================================== */

router.get("/:id", asyncHandler(getJobById));

export default router;