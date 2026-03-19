import mongoose from "mongoose";
import ChatRequest from "../models/ChatRequest.js";
import { Conversation } from "../models/Message.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const normalizePairQuery = (a, b) => ({
  $or: [
    { sender: a, receiver: b },
    { sender: b, receiver: a },
  ],
});

export const getMyChatRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const [sent, received] = await Promise.all([
      ChatRequest.find({ sender: userId })
        .populate("receiver", "fullName email avatar role")
        .sort({ createdAt: -1 })
        .lean(),
      ChatRequest.find({ receiver: userId })
        .populate("sender", "fullName email avatar role")
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    res.status(200).json({
      success: true,
      sent: sent.map((r) => ({
        _id: r._id,
        status: r.status,
        createdAt: r.createdAt,
        user: r.receiver,
      })),
      received: received.map((r) => ({
        _id: r._id,
        status: r.status,
        createdAt: r.createdAt,
        user: r.sender,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// POST /api/chat-request/send/:userId
export const sendChatRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.userId;

    if (!receiverId || !isValidId(receiverId)) {
      return res.status(400).json({ success: false, message: "Invalid user id" });
    }
    if (String(senderId) === String(receiverId)) {
      return res.status(400).json({ success: false, message: "You cannot request yourself" });
    }

    // If an accepted request already exists either direction, keep it accepted.
    const existing = await ChatRequest.findOne(normalizePairQuery(senderId, receiverId));
    if (existing) {
      if (existing.status === "accepted") {
        return res.status(200).json({ success: true, message: "Chat already enabled", request: existing });
      }
      // If receiver previously rejected and sender tries again, set back to pending (simple).
      existing.sender = senderId;
      existing.receiver = receiverId;
      existing.status = "pending";
      await existing.save();
      return res.status(200).json({ success: true, message: "Request sent", request: existing });
    }

    const request = await ChatRequest.create({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    res.status(201).json({ success: true, message: "Request sent", request });
  } catch (error) {
    // duplicate key -> already exists
    if (String(error?.code) === "11000") {
      return res.status(200).json({ success: true, message: "Request already exists" });
    }
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// POST /api/chat-request/accept/:id
export const acceptChatRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ success: false, message: "Invalid request id" });

    const request = await ChatRequest.findById(id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });
    if (String(request.receiver) !== String(userId)) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    request.status = "accepted";
    await request.save();

    // Ensure a conversation exists so both users appear in the list.
    const a = String(request.sender);
    const b = String(request.receiver);
    const existingConvo = await Conversation.findOne({
      participants: { $all: [a, b] },
      job: null,
    });
    if (!existingConvo) {
      await Conversation.create({
        participants: [request.sender, request.receiver],
        job: null,
        lastMessage: null,
      });
    }

    res.status(200).json({ success: true, message: "Request accepted", request });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// POST /api/chat-request/reject/:id
export const rejectChatRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ success: false, message: "Invalid request id" });

    const request = await ChatRequest.findById(id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });
    if (String(request.receiver) !== String(userId)) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    request.status = "rejected";
    await request.save();
    res.status(200).json({ success: true, message: "Request rejected", request });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// helper used by message controller (optional)
export const getChatRequestStatusBetween = async (a, b) => {
  const reqDoc = await ChatRequest.findOne(normalizePairQuery(a, b)).lean();
  if (!reqDoc) return { status: "none", canChat: false };
  return { status: reqDoc.status, canChat: reqDoc.status === "accepted" };
};

