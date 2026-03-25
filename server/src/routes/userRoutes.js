import express from "express";
import {
    getUserProfile,
    updateUserProfile,
    deleteUserAccount,
    searchUsers,
} from "../controllers/user.Controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

// All user routes require authentication
router.use(authMiddleware);

router.get("/profile", asyncHandler(getUserProfile));
router.get("/search", asyncHandler(searchUsers));
router.put("/profile", asyncHandler(updateUserProfile));
router.delete("/profile", asyncHandler(deleteUserAccount));

export default router;
