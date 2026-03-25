import mongoose from "mongoose";
import RecruiterPost from "../models/RecruiterPost.js";
import RecruiterConnection from "../models/RecruiterConnection.js";
import User from "../models/User.js";
import Recruiter from "../models/Recruiter.js";
import Job from "../models/Job.js";
import { enableChatBetween, disableChatBetween } from "../utils/enableJobSeekerChat.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse, sendResponse } from "../utils/ApiResponse.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

async function assertRecruiterUser(userId) {
    const u = await User.findById(userId).select("role").lean();
    return u && u.role === "recruiter";
}

function otherUserIdFromRow(me, row) {
    const uid = String(row.userId);
    const fid = String(row.friendId);
    const m = String(me);
    return uid === m ? fid : uid;
}

export const getRecruiterFeedPosts = async (req, res) => {
    const jobs = await Job.find()
        .populate("recruiter", "fullName email avatar role location")
        .sort({ createdAt: -1 })
        .limit(200)
        .lean();

    const authorIds = [...new Set(jobs.map((j) => String(j.recruiter?._id)).filter(Boolean))];
    const recruiters = await Recruiter.find({ user: { $in: authorIds } })
        .select("user companyName")
        .lean();
    const companyByUser = new Map(recruiters.map((r) => [String(r.user), r.companyName || ""]));

    const list = jobs.map((j) => ({
        _id: j._id,
        jobTitle: j.jobTitle || "",
        company: j.company || "",
        location: j.location || "",
        jobType: j.jobType || "",
        status: j.status || "",
        description: j.description || "",
        skills: Array.isArray(j.skills) ? j.skills : [],
        createdAt: j.createdAt,
        updatedAt: j.updatedAt,
        author: j.recruiter
            ? {
                  _id: j.recruiter._id,
                  fullName: j.recruiter.fullName,
                  email: j.recruiter.email,
                  avatar: j.recruiter.avatar,
                  role: j.recruiter.role,
                  location: j.recruiter.location,
                  companyName: companyByUser.get(String(j.recruiter._id)) || "",
              }
            : null,
    }));

    return sendResponse(res, new ApiResponse(200, { posts: list }));
};

export const createRecruiterFeedPost = async (req, res) => {
    const me = req.user.id;
    if (!(await assertRecruiterUser(me))) {
        throw new ApiError(403, "Only recruiters can post");
    }
    const content = String(req.body?.content || "").trim();
    if (!content) {
        throw new ApiError(400, "Post content cannot be empty");
    }
    if (content.length > 5000) {
        throw new ApiError(400, "Post is too long (max 5000 characters)");
    }

    const post = await RecruiterPost.create({ author: me, content });
    const populated = await RecruiterPost.findById(post._id)
        .populate("author", "fullName email avatar role")
        .lean();

    let companyName = "";
    const rec = await Recruiter.findOne({ user: me }).select("companyName").lean();
    if (rec) companyName = rec.companyName || "";

    return sendResponse(
        res,
        new ApiResponse(201, {
            post: {
                _id: populated._id,
                content: populated.content,
                createdAt: populated.createdAt,
                author: populated.author
                    ? {
                          _id: populated.author._id,
                          fullName: populated.author.fullName,
                          email: populated.author.email,
                          avatar: populated.author.avatar,
                          role: populated.author.role,
                          companyName,
                      }
                    : null,
            },
        }),
    );
};

export const updateRecruiterFeedPost = async (req, res) => {
    const me = req.user.id;
    const { id } = req.params;
    const content = String(req.body?.content || "").trim();

    if (!isValidId(id)) {
        throw new ApiError(400, "Valid post id is required");
    }
    if (!content) {
        throw new ApiError(400, "Post content cannot be empty");
    }
    if (content.length > 5000) {
        throw new ApiError(400, "Post is too long (max 5000 characters)");
    }

    const post = await RecruiterPost.findById(id);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }
    if (String(post.author) !== String(me)) {
        throw new ApiError(403, "You can only update your own posts");
    }

    post.content = content;
    await post.save();

    const populated = await RecruiterPost.findById(post._id)
        .populate("author", "fullName email avatar role")
        .lean();

    let companyName = "";
    const rec = await Recruiter.findOne({ user: me }).select("companyName").lean();
    if (rec) companyName = rec.companyName || "";

    return sendResponse(
        res,
        new ApiResponse(200, {
            message: "Post updated successfully",
            post: {
                _id: populated._id,
                content: populated.content,
                createdAt: populated.createdAt,
                updatedAt: populated.updatedAt,
                author: populated.author
                    ? {
                          _id: populated.author._id,
                          fullName: populated.author.fullName,
                          email: populated.author.email,
                          avatar: populated.author.avatar,
                          role: populated.author.role,
                          companyName,
                      }
                    : null,
            },
        }),
    );
};

export const getRecruiterConnections = async (req, res) => {
    const me = req.user.id;

    const rows = await RecruiterConnection.find({
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

    const [users, recruiters] = await Promise.all([
        User.find({ _id: { $in: allIds } }).select("fullName email avatar location role").lean(),
        Recruiter.find({ user: { $in: allIds } }).select("user companyName").lean(),
    ]);
    const userMap = new Map(users.map((u) => [String(u._id), u]));
    const companyMap = new Map(recruiters.map((r) => [String(r.user), r.companyName || ""]));

    const accepted = [];
    const pendingIncoming = [];
    const pendingOutgoing = [];

    for (const r of rows) {
        const otherId = otherUserIdFromRow(me, r);
        const otherUser = userMap.get(String(otherId));
        const companyName = companyMap.get(String(otherId)) || "";

        const payload = {
            connectionId: r._id,
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
                      companyName,
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
            connections: accepted.filter((x) => x.user),
            pendingIncoming: pendingIncoming.filter((x) => x.user),
            pendingOutgoing: pendingOutgoing.filter((x) => x.user),
        }),
    );
};

export const sendRecruiterConnectionRequest = async (req, res) => {
    const me = req.user.id;
    const { recruiterId } = req.body;

    if (!recruiterId || !isValidId(recruiterId)) {
        throw new ApiError(400, "Valid recruiterId is required");
    }
    if (String(me) === String(recruiterId)) {
        throw new ApiError(400, "You cannot connect with yourself");
    }

    const [iAmRec, theyAreRec] = await Promise.all([
        assertRecruiterUser(me),
        assertRecruiterUser(recruiterId),
    ]);
    if (!iAmRec || !theyAreRec) {
        throw new ApiError(403, "Connections are only between recruiters");
    }

    const existingAccepted = await RecruiterConnection.findOne({
        $or: [
            { userId: me, friendId: recruiterId, status: "accepted" },
            { userId: recruiterId, friendId: me, status: "accepted" },
        ],
    }).lean();
    if (existingAccepted) {
        throw new ApiError(400, "You are already connected");
    }

    const reversePending = await RecruiterConnection.findOne({
        userId: recruiterId,
        friendId: me,
        status: "pending",
    });

    if (reversePending) {
        reversePending.status = "accepted";
        await reversePending.save();
        await enableChatBetween(me, recruiterId);
        return sendResponse(
            res,
            new ApiResponse(200, {
                message: "You are now connected",
                connection: reversePending,
                autoAccepted: true,
            }),
        );
    }

    const dup = await RecruiterConnection.findOne({ userId: me, friendId: recruiterId });
    if (dup && dup.status === "pending") {
        throw new ApiError(400, "Connection request already sent");
    }

    try {
        const connection = await RecruiterConnection.create({
            userId: me,
            friendId: recruiterId,
            status: "pending",
        });
        return sendResponse(
            res,
            new ApiResponse(201, { message: "Connection request sent", connection }),
        );
    } catch (e) {
        if (e?.code === 11000) {
            throw new ApiError(400, "Request already exists");
        }
        throw e;
    }
};

export const acceptRecruiterConnectionRequest = async (req, res) => {
    const me = req.user.id;
    const { requestId } = req.body;

    if (!requestId || !isValidId(requestId)) {
        throw new ApiError(400, "Valid requestId is required");
    }

    const row = await RecruiterConnection.findById(requestId);
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
        new ApiResponse(200, { message: "Connection accepted", connection: row }),
    );
};

export const removeRecruiterConnection = async (req, res) => {
    const me = req.user.id;
    const { id: otherId } = req.params;

    if (!otherId || !isValidId(otherId)) {
        throw new ApiError(400, "Valid id is required");
    }
    if (String(me) === String(otherId)) {
        throw new ApiError(400, "Invalid target");
    }

    const row = await RecruiterConnection.findOne({
        $or: [
            { userId: me, friendId: otherId, status: "accepted" },
            { userId: otherId, friendId: me, status: "accepted" },
        ],
    });

    if (!row) {
        throw new ApiError(404, "Connection not found");
    }

    await RecruiterConnection.deleteOne({ _id: row._id });
    await disableChatBetween(me, otherId);

    return sendResponse(res, new ApiResponse(200, { message: "Connection removed" }));
};
