import express from "express";
import {
    getAllRecruiters,
    getRecruiterById,
    getRecruiterWithJobs,
    getMyRecruiterProfile,
    updateRecruiterProfile,
    uploadRecruiterImage,
    uploadCompanyLogo,
    deleteRecruiterProfile,
    getRecruiterDashboard,
} from "../controllers/recruiter.Controller.js";
import { searchCandidatesForRecruiters } from "../controllers/jobSeeker.Controller.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/", getAllRecruiters);
router.get(
    "/candidates",
    authMiddleware,
    roleMiddleware("recruiter"),
    searchCandidatesForRecruiters
);
router.get("/:id/jobs", getRecruiterWithJobs);
router.get("/:id", getRecruiterById);

router.get("/profile/me", authMiddleware, getMyRecruiterProfile);

router.get("/me/dashboard", authMiddleware, roleMiddleware("recruiter"), getRecruiterDashboard);

router.put("/profile", authMiddleware, updateRecruiterProfile);

router.post(
    "/profile-image",
    authMiddleware,
    upload.single("profileImage"),
    uploadRecruiterImage
);

router.post(
    "/company-logo",
    authMiddleware,
    upload.single("companyLogo"),
    uploadCompanyLogo
);

router.delete("/profile", authMiddleware, deleteRecruiterProfile);

export default router;