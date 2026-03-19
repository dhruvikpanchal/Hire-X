import express from "express";
import {
    getUserProfile,
    updateUserProfile,
    deleteUserAccount,
    searchUsers,
} from "../controllers/user.Controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// All user routes require authentication
router.use(authMiddleware);

router.get("/profile", getUserProfile);
router.get("/search", searchUsers);
router.put("/profile", updateUserProfile);
router.delete("/profile", deleteUserAccount);

export default router;
