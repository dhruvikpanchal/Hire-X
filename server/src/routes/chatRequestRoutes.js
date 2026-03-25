import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  acceptChatRequest,
  getMyChatRequests,
  rejectChatRequest,
  sendChatRequest,
} from "../controllers/chatRequest.Controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/send/:userId", asyncHandler(sendChatRequest));
router.get("/", asyncHandler(getMyChatRequests));
router.post("/accept/:id", asyncHandler(acceptChatRequest));
router.post("/reject/:id", asyncHandler(rejectChatRequest));

export default router;

