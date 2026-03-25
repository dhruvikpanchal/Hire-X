import mongoose from "mongoose";
import Message, { Conversation } from "../models/Message.js";
import Block from "../models/Block.js";
import ChatRequest from "../models/ChatRequest.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse, sendResponse } from "../utils/ApiResponse.js";

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

export const getConversations = async (req, res) => {
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

    return sendResponse(res, new ApiResponse(200, { conversations }));
};

export const getMessagesByConversation = async (req, res) => {
    const userId = req.user.id;
    const { conversationId } = req.params;

    if (!isValidId(conversationId)) {
        throw new ApiError(400, "Invalid conversation id");
    }

    const convo = await Conversation.findById(conversationId).lean();
    if (!convo) throw new ApiError(404, "Conversation not found");

    const isParticipant = (convo.participants || []).some((p) => String(p) === String(userId));
    if (!isParticipant) throw new ApiError(403, "Not authorized");

    const otherUserId = (convo.participants || []).find((p) => String(p) !== String(userId));
    const blockState = otherUserId ? await getBlockState(userId, otherUserId) : { canSend: true };
    const chatReq = otherUserId
        ? await getChatRequestState(userId, otherUserId)
        : { status: "accepted", canChat: true, requestId: null };

    const messages = await Message.find({
        conversation: conversationId,
        deletedFor: { $ne: userId },
    })
        .populate("sender", "fullName email avatar role")
        .sort({ createdAt: 1 })
        .lean();

    return sendResponse(
        res,
        new ApiResponse(200, {
            messages: messages.map((m) => ({
                _id: m._id,
                content: m.content,
                deletedForEveryone: Boolean(m.deletedForEveryone),
                senderId: m.sender?._id || m.sender,
                sender: m.sender
                    ? {
                          _id: m.sender._id,
                          fullName: m.sender.fullName,
                          avatar: m.sender.avatar,
                          role: m.sender.role,
                      }
                    : null,
                createdAt: m.createdAt,
            })),
            block: blockState,
            chatRequest: chatReq,
        }),
    );
};

export const sendMessage = async (req, res) => {
    const senderId = req.user.id;
    const { receiverId, content, conversationId, jobId } = req.body;

    if (!receiverId || !isValidId(receiverId)) {
        throw new ApiError(400, "Valid receiverId is required");
    }
    const trimmed = String(content || "").trim();
    if (!trimmed) throw new ApiError(400, "Message cannot be empty");

    const blockState = await getBlockState(senderId, receiverId);
    if (!blockState.canSend) {
        return sendResponse(
            res,
            new ApiResponse(403, {
                message: blockState.viewerBlockedOther
                    ? "You blocked this user. Unblock to send messages."
                    : "You cannot message this user.",
                block: blockState,
            }),
        );
    }

    const chatReq = await getChatRequestState(senderId, receiverId);
    if (!chatReq.canChat) {
        return sendResponse(
            res,
            new ApiResponse(403, {
                message: "Chat is not enabled yet. Send/accept a chat request first.",
                chatRequest: chatReq,
            }),
        );
    }

    let convo = null;
    if (conversationId) {
        if (!isValidId(conversationId)) throw new ApiError(400, "Invalid conversationId");
        convo = await Conversation.findById(conversationId);
        if (!convo) throw new ApiError(404, "Conversation not found");
        const ok =
            convo.participants.some((p) => String(p) === String(senderId)) &&
            convo.participants.some((p) => String(p) === String(receiverId));
        if (!ok) throw new ApiError(403, "Not authorized");
    } else {
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

    return sendResponse(
        res,
        new ApiResponse(201, {
            message: {
                _id: message._id,
                content: message.content,
                senderId,
                createdAt: message.createdAt,
            },
            conversationId: convo._id,
        }),
    );
};

export const blockUser = async (req, res) => {
    const blockerId = req.user.id;
    const { blockedUserId } = req.body;

    if (!blockedUserId || !isValidId(blockedUserId)) {
        throw new ApiError(400, "Valid blockedUserId is required");
    }

    await Block.updateOne(
        { blocker: blockerId, blockedUser: blockedUserId },
        { $setOnInsert: { blocker: blockerId, blockedUser: blockedUserId } },
        { upsert: true },
    );

    const block = await getBlockState(blockerId, blockedUserId);
    return sendResponse(res, new ApiResponse(200, { message: "User blocked", block }));
};

export const unblockUser = async (req, res) => {
    const blockerId = req.user.id;
    const { blockedUserId } = req.body;

    if (!blockedUserId || !isValidId(blockedUserId)) {
        throw new ApiError(400, "Valid blockedUserId is required");
    }

    await Block.deleteOne({ blocker: blockerId, blockedUser: blockedUserId });
    const block = await getBlockState(blockerId, blockedUserId);
    return sendResponse(res, new ApiResponse(200, { message: "User unblocked", block }));
};

export const getBlockedUsers = async (req, res) => {
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

    return sendResponse(res, new ApiResponse(200, { blocked }));
};

export const deleteMessage = async (req, res) => {
    const userId = req.user.id;
    const { messageId } = req.params;
    const mode = String(req.query.mode || "me").toLowerCase();

    if (!isValidId(messageId)) {
        throw new ApiError(400, "Invalid message id");
    }

    const msg = await Message.findById(messageId).lean();
    if (!msg) throw new ApiError(404, "Message not found");

    const convo = await Conversation.findById(msg.conversation).lean();
    if (!convo) throw new ApiError(404, "Conversation not found");

    const isParticipant = (convo.participants || []).some((p) => String(p) === String(userId));
    if (!isParticipant) throw new ApiError(403, "Not authorized");

    if (mode === "everyone") {
        if (String(msg.sender) !== String(userId)) {
            throw new ApiError(403, "Only sender can delete for everyone");
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

    return sendResponse(
        res,
        new ApiResponse(200, {
            message: mode === "everyone" ? "Message deleted for everyone" : "Message deleted for you",
            deletedMessageId: msg._id,
            mode,
            conversationId: msg.conversation,
        }),
    );
};

export const deleteAllMessages = async (req, res) => {
    const userId = req.user.id;
    const { conversationId } = req.params;

    if (!isValidId(conversationId)) {
        throw new ApiError(400, "Invalid conversation id");
    }

    const convo = await Conversation.findById(conversationId).lean();
    if (!convo) throw new ApiError(404, "Conversation not found");

    const isParticipant = (convo.participants || []).some((p) => String(p) === String(userId));
    if (!isParticipant) throw new ApiError(403, "Not authorized");

    await Message.deleteMany({ conversation: conversationId });
    await Conversation.findByIdAndUpdate(conversationId, { lastMessage: null });

    return sendResponse(
        res,
        new ApiResponse(200, {
            message: "All messages deleted",
            conversationId,
        }),
    );
};

export const clearConversationForMe = async (req, res) => {
    const userId = req.user.id;
    const { conversationId } = req.params;

    if (!isValidId(conversationId)) {
        throw new ApiError(400, "Invalid conversation id");
    }

    const convo = await Conversation.findById(conversationId).lean();
    if (!convo) throw new ApiError(404, "Conversation not found");

    const isParticipant = (convo.participants || []).some((p) => String(p) === String(userId));
    if (!isParticipant) throw new ApiError(403, "Not authorized");

    await Message.updateMany(
        { conversation: conversationId, deletedFor: { $ne: userId } },
        { $addToSet: { deletedFor: userId } },
    );

    return sendResponse(
        res,
        new ApiResponse(200, {
            message: "Conversation cleared for you",
            conversationId,
        }),
    );
};

export const editMessage = async (req, res) => {
    const userId = req.user.id;
    const { messageId } = req.params;
    const content = String(req.body?.content || "").trim();

    if (!isValidId(messageId)) {
        throw new ApiError(400, "Invalid message id");
    }
    if (!content) {
        throw new ApiError(400, "Message cannot be empty");
    }

    const msg = await Message.findById(messageId);
    if (!msg) throw new ApiError(404, "Message not found");
    if (String(msg.sender) !== String(userId)) {
        throw new ApiError(403, "You can only edit your own messages");
    }
    if (msg.deletedForEveryone) {
        throw new ApiError(400, "Deleted messages cannot be edited");
    }

    msg.content = content;
    await msg.save();
    await refreshConversationLastMessage(msg.conversation);

    return sendResponse(
        res,
        new ApiResponse(200, {
            message: "Message updated",
            updatedMessage: {
                _id: msg._id,
                content: msg.content,
                updatedAt: msg.updatedAt,
            },
            conversationId: msg.conversation,
        }),
    );
};
