import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  getConversations,
  getMessagesByConversation,
  sendMessage,
  blockUser,
  unblockUser,
  getBlockedUsers,
} from "../controllers/message.Controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/blocked", getBlockedUsers);
router.get("/conversations", getConversations);
router.get("/conversations/:conversationId", getMessagesByConversation);
router.post("/send", sendMessage);
router.post("/block", blockUser);
router.post("/unblock", unblockUser);

export default router;

