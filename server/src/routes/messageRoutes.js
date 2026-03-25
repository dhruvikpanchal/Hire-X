import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  getConversations,
  getMessagesByConversation,
  sendMessage,
  blockUser,
  unblockUser,
  getBlockedUsers,
  deleteMessage,
  deleteAllMessages,
  clearConversationForMe,
  editMessage,
} from "../controllers/message.Controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/blocked", asyncHandler(getBlockedUsers));
router.get("/conversations", asyncHandler(getConversations));
router.get("/conversations/:conversationId", asyncHandler(getMessagesByConversation));
router.delete("/conversations/:conversationId/all", asyncHandler(deleteAllMessages));
router.post("/conversations/:conversationId/clear-me", asyncHandler(clearConversationForMe));
router.post("/send", asyncHandler(sendMessage));
router.post("/block", asyncHandler(blockUser));
router.post("/unblock", asyncHandler(unblockUser));
router.patch("/:messageId", asyncHandler(editMessage));
router.delete("/:messageId", asyncHandler(deleteMessage));

export default router;

