import mongoose from "mongoose";
import Friend from "../models/Friend.js";
import User from "../models/User.js";
import JobSeeker from "../models/JobSeeker.js";
import { enableChatBetween, disableChatBetween } from "../utils/enableJobSeekerChat.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse, sendResponse } from "../utils/ApiResponse.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

async function assertJobSeekerUser(userId) {
    const u = await User.findById(userId).select("role").lean();
    return u && u.role === "jobseeker";
}

function otherUserIdFromFriendRow(me, row) {
    const uid = String(row.userId);
    const fid = String(row.friendId);
    const m = String(me);
    return uid === m ? fid : uid;
}

export const sendFriendRequest = async (req, res) => {
    const me = req.user.id;
    const { friendId } = req.body;

    if (!friendId || !isValidId(friendId)) {
        throw new ApiError(400, "Valid friendId is required");
    }
    if (String(me) === String(friendId)) {
        throw new ApiError(400, "You cannot add yourself");
    }

    const [iAmSeeker, theyAreSeeker] = await Promise.all([
        assertJobSeekerUser(me),
        assertJobSeekerUser(friendId),
    ]);
    if (!iAmSeeker || !theyAreSeeker) {
        throw new ApiError(403, "Friends are only available between job seekers");
    }

    const existingAccepted = await Friend.findOne({
        $or: [
            { userId: me, friendId, status: "accepted" },
            { userId: friendId, friendId: me, status: "accepted" },
        ],
    }).lean();
    if (existingAccepted) {
        throw new ApiError(400, "You are already friends");
    }

    const reversePending = await Friend.findOne({
        userId: friendId,
        friendId: me,
        status: "pending",
    });

    if (reversePending) {
        reversePending.status = "accepted";
        await reversePending.save();
        await enableChatBetween(me, friendId);
        return sendResponse(
            res,
            new ApiResponse(200, {
                message: "You are now friends",
                friendship: reversePending,
                autoAccepted: true,
            }),
        );
    }

    const dup = await Friend.findOne({ userId: me, friendId });
    if (dup && dup.status === "pending") {
        throw new ApiError(400, "Friend request already sent");
    }

    try {
        const friendship = await Friend.create({ userId: me, friendId, status: "pending" });
        return sendResponse(
            res,
            new ApiResponse(201, { message: "Friend request sent", friendship }),
        );
    } catch (e) {
        if (e?.code === 11000) {
            throw new ApiError(400, "Request already exists");
        }
        throw e;
    }
};

export const acceptFriendRequest = async (req, res) => {
    const me = req.user.id;
    const { requestId } = req.body;

    if (!requestId || !isValidId(requestId)) {
        throw new ApiError(400, "Valid requestId is required");
    }

    const row = await Friend.findById(requestId);
    if (!row) {
        throw new ApiError(404, "Request not found");
    }
    if (String(row.friendId) !== String(me)) {
        throw new ApiError(403, "Not authorized to accept this request");
    }
    if (row.status !== "pending") {
        throw new ApiError(400, "Request is not pending");
    }

    row.status = "accepted";
    await row.save();
    await enableChatBetween(row.userId, row.friendId);

    return sendResponse(
        res,
        new ApiResponse(200, { message: "Friend request accepted", friendship: row }),
    );
};

export const getFriends = async (req, res) => {
    const me = req.user.id;

    const rows = await Friend.find({
        $or: [{ userId: me }, { friendId: me }],
    })
        .sort({ updatedAt: -1 })
        .lean();

    const idSet = new Set();
    rows.forEach((r) => {
        idSet.add(String(r.userId));
        idSet.add(String(r.friendId));
    });
    const allIds = [...idSet].filter((id) => mongoose.Types.ObjectId.isValid(id));

    const [users, profiles] = await Promise.all([
        User.find({ _id: { $in: allIds } }).select("fullName email avatar location role").lean(),
        JobSeeker.find({ user: { $in: allIds } }).select("user jobTitle").lean(),
    ]);
    const userMap = new Map(users.map((u) => [String(u._id), u]));
    const profileMap = new Map(profiles.map((p) => [String(p.user), p]));

    const accepted = [];
    const pendingIncoming = [];
    const pendingOutgoing = [];

    for (const r of rows) {
        const otherId = otherUserIdFromFriendRow(me, r);
        const otherUser = userMap.get(String(otherId));
        const jp = profileMap.get(String(otherId));

        const payload = {
            friendshipId: r._id,
            status: r.status,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
            user: otherUser
                ? {
                      _id: otherUser._id,
                      fullName: otherUser.fullName,
                      email: otherUser.email,
                      avatar: otherUser.avatar,
                      location: otherUser.location,
                      role: otherUser.role,
                      jobTitle: jp?.jobTitle || "",
                  }
                : null,
        };

        if (r.status === "accepted") {
            accepted.push(payload);
        } else if (r.status === "pending") {
            if (String(r.userId) === String(me)) {
                pendingOutgoing.push(payload);
            } else {
                pendingIncoming.push(payload);
            }
        }
    }

    return sendResponse(
        res,
        new ApiResponse(200, {
            friends: accepted.filter((x) => x.user),
            pendingIncoming: pendingIncoming.filter((x) => x.user),
            pendingOutgoing: pendingOutgoing.filter((x) => x.user),
        }),
    );
};

export const removeFriend = async (req, res) => {
    const me = req.user.id;
    const { id: otherId } = req.params;

    if (!otherId || !isValidId(otherId)) {
        throw new ApiError(400, "Valid id is required");
    }
    if (String(me) === String(otherId)) {
        throw new ApiError(400, "Invalid target");
    }

    const row = await Friend.findOne({
        $or: [
            { userId: me, friendId: otherId, status: "accepted" },
            { userId: otherId, friendId: me, status: "accepted" },
        ],
    });

    if (!row) {
        throw new ApiError(404, "Friend connection not found");
    }

    await Friend.deleteOne({ _id: row._id });
    await disableChatBetween(me, otherId);

    return sendResponse(res, new ApiResponse(200, { message: "Friend removed" }));
};
