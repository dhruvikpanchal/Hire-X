import express from "express";
import {
    getAllRecruiters,
    getRecruiterById,
    updateRecruiterProfile,
    uploadCompanyLogo
} from "../controllers/recruiterController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/", getAllRecruiters);
router.get("/:id", getRecruiterById);

// Protected routes (Employers only)
router.put(
    "/profile",
    authMiddleware,
    roleMiddleware("employer"),
    updateRecruiterProfile
);

router.post(
    "/company-logo",
    authMiddleware,
    roleMiddleware("employer"),
    upload.single("companyLogo"),
    uploadCompanyLogo
);

export default router;
