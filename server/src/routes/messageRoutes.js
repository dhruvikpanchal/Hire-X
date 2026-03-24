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

const router = express.Router();

router.use(authMiddleware);

router.get("/blocked", getBlockedUsers);
router.get("/conversations", getConversations);
router.get("/conversations/:conversationId", getMessagesByConversation);
router.delete("/conversations/:conversationId/all", deleteAllMessages);
router.post("/conversations/:conversationId/clear-me", clearConversationForMe);
router.post("/send", sendMessage);
router.post("/block", blockUser);
router.post("/unblock", unblockUser);
router.patch("/:messageId", editMessage);
router.delete("/:messageId", deleteMessage);

export default router;

