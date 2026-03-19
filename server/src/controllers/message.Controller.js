import mongoose from "mongoose";
import Message, { Conversation } from "../models/Message.js";
import Block from "../models/Block.js";
import ChatRequest from "../models/ChatRequest.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

async function getBlockState(viewerId, otherUserId) {
  const [viewerBlockedOther, otherBlockedViewer] = await Promise.all([
    Block.findOne({ blocker: viewerId, blockedUser: otherUserId }).lean(),
    Block.findOne({ blocker: otherUserId, blockedUser: viewerId }).lean(),
  ]);

  return {
    viewerBlockedOther: Boolean(viewerBlockedOther),
    otherBlockedViewer: Boolean(otherBlockedViewer),
    canSend: !viewerBlockedOther && !otherBlockedViewer,
  };
}

async function getChatRequestState(a, b) {
  const doc = await ChatRequest.findOne({
    $or: [
      { sender: a, receiver: b },
      { sender: b, receiver: a },
    ],
  }).lean();

  if (!doc) return { status: "none", canChat: false, requestId: null };
  return { status: doc.status, canChat: doc.status === "accepted", requestId: doc._id };
}

/* =========================================================
   GET CONVERSATIONS (for logged-in user)
   GET /api/messages/conversations
========================================================= */
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const convos = await Conversation.find({ participants: userId })
      .populate("participants", "fullName email avatar role")
      .populate({
        path: "lastMessage",
        select: "content sender createdAt",
        populate: { path: "sender", select: "fullName email role" },
      })
      .sort({ updatedAt: -1 })
      .lean();

    const conversations = convos.map((c) => {
      const other = (c.participants || []).find((p) => String(p._id) !== String(userId));
      return {
        _id: c._id,
        otherUser: other
          ? {
              _id: other._id,
              fullName: other.fullName,
              email: other.email,
              avatar: other.avatar,
              role: other.role,
            }
          : null,
        lastMessage: c.lastMessage
          ? {
              content: c.lastMessage.content,
              senderId: c.lastMessage.sender?._id || c.lastMessage.sender,
              createdAt: c.lastMessage.createdAt,
            }
          : null,
        updatedAt: c.updatedAt,
        job: c.job || null,
      };
    });

    res.status(200).json({ success: true, conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/* =========================================================
   GET MESSAGES BY CONVERSATION
   GET /api/messages/conversations/:conversationId
========================================================= */
export const getMessagesByConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    if (!isValidId(conversationId)) {
      return res.status(400).json({ success: false, message: "Invalid conversation id" });
    }

    const convo = await Conversation.findById(conversationId).lean();
    if (!convo) return res.status(404).json({ success: false, message: "Conversation not found" });

    const isParticipant = (convo.participants || []).some((p) => String(p) === String(userId));
    if (!isParticipant) return res.status(403).json({ success: false, message: "Not authorized" });

    const otherUserId = (convo.participants || []).find((p) => String(p) !== String(userId));
    const blockState = otherUserId ? await getBlockState(userId, otherUserId) : { canSend: true };
    const chatReq = otherUserId ? await getChatRequestState(userId, otherUserId) : { status: "accepted", canChat: true, requestId: null };

    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "fullName email avatar role")
      .sort({ createdAt: 1 })
      .lean();

    res.status(200).json({
      success: true,
      messages: messages.map((m) => ({
        _id: m._id,
        content: m.content,
        senderId: m.sender?._id || m.sender,
        sender: m.sender
          ? { _id: m.sender._id, fullName: m.sender.fullName, avatar: m.sender.avatar, role: m.sender.role }
          : null,
        createdAt: m.createdAt,
      })),
      block: blockState,
      chatRequest: chatReq,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/* =========================================================
   SEND MESSAGE
   POST /api/messages/send
   body: { receiverId, content, conversationId?, jobId? }
========================================================= */
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, content, conversationId, jobId } = req.body;

    if (!receiverId || !isValidId(receiverId)) {
      return res.status(400).json({ success: false, message: "Valid receiverId is required" });
    }
    const trimmed = String(content || "").trim();
    if (!trimmed) return res.status(400).json({ success: false, message: "Message cannot be empty" });

    const blockState = await getBlockState(senderId, receiverId);
    if (!blockState.canSend) {
      return res.status(403).json({
        success: false,
        message: blockState.viewerBlockedOther
          ? "You blocked this user. Unblock to send messages."
          : "You cannot message this user.",
        block: blockState,
      });
    }

    const chatReq = await getChatRequestState(senderId, receiverId);
    if (!chatReq.canChat) {
      return res.status(403).json({
        success: false,
        message: "Chat is not enabled yet. Send/accept a chat request first.",
        chatRequest: chatReq,
      });
    }

    let convo = null;
    if (conversationId) {
      if (!isValidId(conversationId)) return res.status(400).json({ success: false, message: "Invalid conversationId" });
      convo = await Conversation.findById(conversationId);
      if (!convo) return res.status(404).json({ success: false, message: "Conversation not found" });
      const ok = convo.participants.some((p) => String(p) === String(senderId)) &&
        convo.participants.some((p) => String(p) === String(receiverId));
      if (!ok) return res.status(403).json({ success: false, message: "Not authorized" });
    } else {
      // find or create
      convo = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
        job: jobId || null,
      });
      if (!convo) {
        convo = await Conversation.create({
          participants: [senderId, receiverId],
          job: jobId || null,
        });
      }
    }

    const message = await Message.create({
      conversation: convo._id,
      sender: senderId,
      content: trimmed,
    });

    convo.lastMessage = message._id;
    await convo.save();

    res.status(201).json({
      success: true,
      message: {
        _id: message._id,
        content: message.content,
        senderId,
        createdAt: message.createdAt,
      },
      conversationId: convo._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/* =========================================================
   BLOCK USER
   POST /api/messages/block
   body: { blockedUserId }
========================================================= */
export const blockUser = async (req, res) => {
  try {
    const blockerId = req.user.id;
    const { blockedUserId } = req.body;

    if (!blockedUserId || !isValidId(blockedUserId)) {
      return res.status(400).json({ success: false, message: "Valid blockedUserId is required" });
    }

    await Block.updateOne(
      { blocker: blockerId, blockedUser: blockedUserId },
      { $setOnInsert: { blocker: blockerId, blockedUser: blockedUserId } },
      { upsert: true },
    );

    const block = await getBlockState(blockerId, blockedUserId);
    res.status(200).json({ success: true, message: "User blocked", block });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/* =========================================================
   UNBLOCK USER
   POST /api/messages/unblock
   body: { blockedUserId }
========================================================= */
export const unblockUser = async (req, res) => {
  try {
    const blockerId = req.user.id;
    const { blockedUserId } = req.body;

    if (!blockedUserId || !isValidId(blockedUserId)) {
      return res.status(400).json({ success: false, message: "Valid blockedUserId is required" });
    }

    await Block.deleteOne({ blocker: blockerId, blockedUser: blockedUserId });
    const block = await getBlockState(blockerId, blockedUserId);
    res.status(200).json({ success: true, message: "User unblocked", block });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

