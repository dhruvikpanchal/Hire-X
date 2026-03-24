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

async function refreshConversationLastMessage(conversationId) {
  const latest = await Message.findOne({ conversation: conversationId })
    .sort({ createdAt: -1 })
    .select("_id")
    .lean();
  await Conversation.findByIdAndUpdate(conversationId, { lastMessage: latest?._id || null });
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

    const messages = await Message.find({
      conversation: conversationId,
      deletedFor: { $ne: userId },
    })
      .populate("sender", "fullName email avatar role")
      .sort({ createdAt: 1 })
      .lean();

    res.status(200).json({
      success: true,
      messages: messages.map((m) => ({
        _id: m._id,
        content: m.content,
        deletedForEveryone: Boolean(m.deletedForEveryone),
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

/* =========================================================
   GET USERS I BLOCKED
   GET /api/messages/blocked
========================================================= */
export const getBlockedUsers = async (req, res) => {
  try {
    const userId = req.user.id;

    const blocks = await Block.find({ blocker: userId })
      .populate("blockedUser", "fullName email avatar role")
      .sort({ updatedAt: -1 })
      .lean();

    const blocked = (blocks || [])
      .filter((b) => b.blockedUser)
      .map((b) => ({
        blockId: b._id,
        _id: b.blockedUser._id,
        fullName: b.blockedUser.fullName,
        email: b.blockedUser.email,
        avatar: b.blockedUser.avatar,
        role: b.blockedUser.role,
        blockedAt: b.updatedAt || b.createdAt,
      }));

    res.status(200).json({ success: true, blocked });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/* =========================================================
  DELETE ONE MESSAGE (sender only)
  DELETE /api/messages/:messageId
========================================================= */
export const deleteMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { messageId } = req.params;
    const mode = String(req.query.mode || "me").toLowerCase();

    if (!isValidId(messageId)) {
      return res.status(400).json({ success: false, message: "Invalid message id" });
    }

    const msg = await Message.findById(messageId).lean();
    if (!msg) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    const convo = await Conversation.findById(msg.conversation).lean();
    if (!convo) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    const isParticipant = (convo.participants || []).some((p) => String(p) === String(userId));
    if (!isParticipant) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (mode === "everyone") {
      if (String(msg.sender) !== String(userId)) {
        return res.status(403).json({ success: false, message: "Only sender can delete for everyone" });
      }

      await Message.updateOne(
        { _id: msg._id },
        {
          $set: {
            content: "This message was deleted",
            deletedForEveryone: true,
          },
        },
      );
      await refreshConversationLastMessage(msg.conversation);
    } else {
      await Message.updateOne({ _id: msg._id }, { $addToSet: { deletedFor: userId } });
    }

    return res.status(200).json({
      success: true,
      message: mode === "everyone" ? "Message deleted for everyone" : "Message deleted for you",
      deletedMessageId: msg._id,
      mode,
      conversationId: msg.conversation,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/* =========================================================
  DELETE ALL MESSAGES IN CONVERSATION
  DELETE /api/messages/conversations/:conversationId/all
========================================================= */
export const deleteAllMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    if (!isValidId(conversationId)) {
      return res.status(400).json({ success: false, message: "Invalid conversation id" });
    }

    const convo = await Conversation.findById(conversationId).lean();
    if (!convo) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    const isParticipant = (convo.participants || []).some((p) => String(p) === String(userId));
    if (!isParticipant) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await Message.deleteMany({ conversation: conversationId });
    await Conversation.findByIdAndUpdate(conversationId, { lastMessage: null });

    return res.status(200).json({
      success: true,
      message: "All messages deleted",
      conversationId,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/* =========================================================
  CLEAR CONVERSATION FOR ME
  POST /api/messages/conversations/:conversationId/clear-me
========================================================= */
export const clearConversationForMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    if (!isValidId(conversationId)) {
      return res.status(400).json({ success: false, message: "Invalid conversation id" });
    }

    const convo = await Conversation.findById(conversationId).lean();
    if (!convo) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    const isParticipant = (convo.participants || []).some((p) => String(p) === String(userId));
    if (!isParticipant) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await Message.updateMany(
      { conversation: conversationId, deletedFor: { $ne: userId } },
      { $addToSet: { deletedFor: userId } },
    );

    return res.status(200).json({
      success: true,
      message: "Conversation cleared for you",
      conversationId,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/* =========================================================
  EDIT MESSAGE (sender only)
  PATCH /api/messages/:messageId
========================================================= */
export const editMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { messageId } = req.params;
    const content = String(req.body?.content || "").trim();

    if (!isValidId(messageId)) {
      return res.status(400).json({ success: false, message: "Invalid message id" });
    }
    if (!content) {
      return res.status(400).json({ success: false, message: "Message cannot be empty" });
    }

    const msg = await Message.findById(messageId);
    if (!msg) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }
    if (String(msg.sender) !== String(userId)) {
      return res.status(403).json({ success: false, message: "You can only edit your own messages" });
    }
    if (msg.deletedForEveryone) {
      return res.status(400).json({ success: false, message: "Deleted messages cannot be edited" });
    }

    msg.content = content;
    await msg.save();
    await refreshConversationLastMessage(msg.conversation);

    return res.status(200).json({
      success: true,
      message: "Message updated",
      updatedMessage: {
        _id: msg._id,
        content: msg.content,
        updatedAt: msg.updatedAt,
      },
      conversationId: msg.conversation,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

