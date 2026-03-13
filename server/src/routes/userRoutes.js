import express from "express";
import {
    getUserProfile,
    updateUserProfile,
    deleteUserAccount
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// All user routes require authentication
router.use(authMiddleware);

router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);
router.delete("/profile", deleteUserAccount);

export default router;
