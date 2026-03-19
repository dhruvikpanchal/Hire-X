import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  acceptChatRequest,
  getMyChatRequests,
  rejectChatRequest,
  sendChatRequest,
} from "../controllers/chatRequest.Controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/send/:userId", sendChatRequest);
router.get("/", getMyChatRequests);
router.post("/accept/:id", acceptChatRequest);
router.post("/reject/:id", rejectChatRequest);

export default router;

