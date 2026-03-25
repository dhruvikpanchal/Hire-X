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
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(getAllRecruiters));

router.get(
    "/candidates",
    authMiddleware,
    roleMiddleware("recruiter"),
    asyncHandler(searchCandidatesForRecruiters)
);

/* Feed & recruiter-to-recruiter connections — must be registered before /:id */
router.get(
    "/feed/posts",
    authMiddleware,
    roleMiddleware("recruiter"),
    asyncHandler(getRecruiterFeedPosts),
);
router.post(
    "/feed/posts",
    authMiddleware,
    roleMiddleware("recruiter"),
    asyncHandler(createRecruiterFeedPost),
);
router.patch(
    "/feed/posts/:id",
    authMiddleware,
    roleMiddleware("recruiter"),
    asyncHandler(updateRecruiterFeedPost),
);
router.get(
    "/connections",
    authMiddleware,
    roleMiddleware("recruiter"),
    asyncHandler(getRecruiterConnections),
);
router.post(
    "/connections/request",
    authMiddleware,
    roleMiddleware("recruiter"),
    asyncHandler(sendRecruiterConnectionRequest),
);
router.post(
    "/connections/accept",
    authMiddleware,
    roleMiddleware("recruiter"),
    asyncHandler(acceptRecruiterConnectionRequest),
);
router.delete(
    "/connections/:id",
    authMiddleware,
    roleMiddleware("recruiter"),
    asyncHandler(removeRecruiterConnection),
);

router.get("/profile/me", authMiddleware, asyncHandler(getMyRecruiterProfile));

router.get("/me/dashboard", authMiddleware, roleMiddleware("recruiter"), asyncHandler(getRecruiterDashboard));

router.put("/profile", authMiddleware, asyncHandler(updateRecruiterProfile));

router.post(
    "/profile-image",
    authMiddleware,
    upload.single("profileImage"),
    asyncHandler(uploadRecruiterImage)
);

router.post(
    "/company-logo",
    authMiddleware,
    upload.single("companyLogo"),
    asyncHandler(uploadCompanyLogo)
);

router.delete("/profile", authMiddleware, asyncHandler(deleteRecruiterProfile));

router.get("/:id/jobs", asyncHandler(getRecruiterWithJobs));
router.get("/:id", asyncHandler(getRecruiterById));

export default router;
