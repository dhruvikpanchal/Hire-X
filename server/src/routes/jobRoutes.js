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

const router = express.Router();

/* ==================================================
   Public Routes
================================================== */

router.get("/", getAllJobs);


/* ==================================================
   Recruiter Protected Routes
================================================== */

router.get("/my-jobs", authMiddleware, getMyJobs);

router.post("/", authMiddleware, createJob);

router.put("/:id", authMiddleware, updateJob);

router.delete("/:id", authMiddleware, deleteJob);


/* ==================================================
   Dynamic Route (KEEP LAST)
================================================== */

router.get("/:id", getJobById);

export default router;