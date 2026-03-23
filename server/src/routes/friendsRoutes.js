import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import {
  sendFriendRequest,
  acceptFriendRequest,
  getFriends,
  removeFriend,
} from "../controllers/friends.Controller.js";

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware("jobseeker"));

router.post("/request", sendFriendRequest);
router.post("/accept", acceptFriendRequest);
router.get("/", getFriends);
router.delete("/:id", removeFriend);

export default router;
