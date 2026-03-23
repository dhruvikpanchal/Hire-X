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
import {
    getRecruiterFeedPosts,
    createRecruiterFeedPost,
    updateRecruiterFeedPost,
    getRecruiterConnections,
    sendRecruiterConnectionRequest,
    acceptRecruiterConnectionRequest,
    removeRecruiterConnection,
} from "../controllers/recruiterSocial.Controller.js";

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

/* Feed & recruiter-to-recruiter connections — must be registered before /:id */
router.get(
    "/feed/posts",
    authMiddleware,
    roleMiddleware("recruiter"),
    getRecruiterFeedPosts,
);
router.post(
    "/feed/posts",
    authMiddleware,
    roleMiddleware("recruiter"),
    createRecruiterFeedPost,
);
router.patch(
    "/feed/posts/:id",
    authMiddleware,
    roleMiddleware("recruiter"),
    updateRecruiterFeedPost,
);
router.get(
    "/connections",
    authMiddleware,
    roleMiddleware("recruiter"),
    getRecruiterConnections,
);
router.post(
    "/connections/request",
    authMiddleware,
    roleMiddleware("recruiter"),
    sendRecruiterConnectionRequest,
);
router.post(
    "/connections/accept",
    authMiddleware,
    roleMiddleware("recruiter"),
    acceptRecruiterConnectionRequest,
);
router.delete(
    "/connections/:id",
    authMiddleware,
    roleMiddleware("recruiter"),
    removeRecruiterConnection,
);

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

router.get("/:id/jobs", getRecruiterWithJobs);
router.get("/:id", getRecruiterById);

export default router;
