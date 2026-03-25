import mongoose from "mongoose";
import ChatRequest from "../models/ChatRequest.js";
import { Conversation } from "../models/Message.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse, sendResponse } from "../utils/ApiResponse.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const normalizePairQuery = (a, b) => ({
    $or: [
        { sender: a, receiver: b },
        { sender: b, receiver: a },
    ],
});

export const getMyChatRequests = async (req, res) => {
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

    return sendResponse(
        res,
        new ApiResponse(200, {
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
        }),
    );
};

export const sendChatRequest = async (req, res) => {
    const senderId = req.user.id;
    const receiverId = req.params.userId;

    if (!receiverId || !isValidId(receiverId)) {
        throw new ApiError(400, "Invalid user id");
    }
    if (String(senderId) === String(receiverId)) {
        throw new ApiError(400, "You cannot request yourself");
    }

    const existing = await ChatRequest.findOne(normalizePairQuery(senderId, receiverId));
    if (existing) {
        if (existing.status === "accepted") {
            return sendResponse(
                res,
                new ApiResponse(200, { message: "Chat already enabled", request: existing }),
            );
        }
        existing.sender = senderId;
        existing.receiver = receiverId;
        existing.status = "pending";
        await existing.save();
        return sendResponse(
            res,
            new ApiResponse(200, { message: "Request sent", request: existing }),
        );
    }

    try {
        const request = await ChatRequest.create({
            sender: senderId,
            receiver: receiverId,
            status: "pending",
        });
        return sendResponse(
            res,
            new ApiResponse(201, { message: "Request sent", request }),
        );
    } catch (error) {
        if (String(error?.code) === "11000") {
            return sendResponse(res, new ApiResponse(200, { message: "Request already exists" }));
        }
        throw error;
    }
};

export const acceptChatRequest = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    if (!isValidId(id)) throw new ApiError(400, "Invalid request id");

    const request = await ChatRequest.findById(id);
    if (!request) throw new ApiError(404, "Request not found");
    if (String(request.receiver) !== String(userId)) {
        throw new ApiError(403, "Not authorized");
    }

    request.status = "accepted";
    await request.save();

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

    return sendResponse(
        res,
        new ApiResponse(200, { message: "Request accepted", request }),
    );
};

export const rejectChatRequest = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    if (!isValidId(id)) throw new ApiError(400, "Invalid request id");

    const request = await ChatRequest.findById(id);
    if (!request) throw new ApiError(404, "Request not found");
    if (String(request.receiver) !== String(userId)) {
        throw new ApiError(403, "Not authorized");
    }

    request.status = "rejected";
    await request.save();
    return sendResponse(
        res,
        new ApiResponse(200, { message: "Request rejected", request }),
    );
};

export const getChatRequestStatusBetween = async (a, b) => {
    const reqDoc = await ChatRequest.findOne(normalizePairQuery(a, b)).lean();
    if (!reqDoc) return { status: "none", canChat: false };
    return { status: reqDoc.status, canChat: reqDoc.status === "accepted" };
};
