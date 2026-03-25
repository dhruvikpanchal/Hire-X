import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    verifyOTP,
    resetPassword,
} from "../controllers/auth.Controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();


router.post("/register", asyncHandler(registerUser));
router.post("/login", asyncHandler(loginUser));
router.post("/logout", asyncHandler(logoutUser));
router.post("/forgot-password", asyncHandler(forgotPassword));
router.post("/verify-otp", asyncHandler(verifyOTP));
router.post("/reset-password", asyncHandler(resetPassword));

export default router;
