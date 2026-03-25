import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse, sendResponse } from "../utils/ApiResponse.js";

export const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return sendResponse(
        res,
        new ApiResponse(200, {
            message: "Profile fetched successfully",
            data: user,
        }),
    );
};

export const updateUserProfile = async (req, res) => {
    const { fullName, username, phone, location, avatar } = req.body;

    if (username) {
        const existingUser = await User.findOne({ username });
        if (existingUser && existingUser._id.toString() !== req.user.id) {
            throw new ApiError(400, "Username is already taken");
        }
    }

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (username) updateData.username = username;
    if (phone !== undefined) updateData.phone = phone;
    if (location !== undefined) updateData.location = location;
    if (avatar !== undefined) updateData.avatar = avatar;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
        new: true,
        runValidators: true,
    }).select("-password");

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    return sendResponse(
        res,
        new ApiResponse(200, {
            message: "Profile updated successfully",
            data: updatedUser,
        }),
    );
};

export const deleteUserAccount = async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    await User.findByIdAndDelete(req.user.id);

    return sendResponse(
        res,
        new ApiResponse(200, {
            message: "User account deleted successfully",
            data: null,
        }),
    );
};

export const searchUsers = async (req, res) => {
    const userId = req.user.id;
    const q = String(req.query.q || "").trim();

    if (!q || q.length < 2) {
        return sendResponse(res, new ApiResponse(200, { users: [] }));
    }

    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const users = await User.find({
        _id: { $ne: userId },
        $or: [{ fullName: regex }, { email: regex }],
    })
        .select("fullName email avatar role")
        .limit(15)
        .lean();

    return sendResponse(res, new ApiResponse(200, { users }));
};
