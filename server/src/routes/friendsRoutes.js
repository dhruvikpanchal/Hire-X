import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import {
  sendFriendRequest,
  acceptFriendRequest,
  getFriends,
  removeFriend,
} from "../controllers/friends.Controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware("jobseeker"));

router.post("/request", asyncHandler(sendFriendRequest));
router.post("/accept", asyncHandler(acceptFriendRequest));
router.get("/", asyncHandler(getFriends));
router.delete("/:id", asyncHandler(removeFriend));

export default router;
