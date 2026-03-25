import { sendEmail, forgotPasswordOTPContent } from "../utils/mail.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import JobSeeker from "../models/JobSeeker.js";
import Recruiter from "../models/Recruiter.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse, sendResponse } from "../utils/ApiResponse.js";

const registerUser = async (req, res) => {
    const { fullName, username, email, password, role } = req.body;

    if (!fullName || !username || !email || !password || !role) {
        throw new ApiError(400, "Please provide all required fields");
    }

    if (!["jobseeker", "recruiter"].includes(role)) {
        throw new ApiError(400, "Invalid role. Must be 'jobseeker' or 'recruiter'");
    }

    const userExists = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (userExists) {
        throw new ApiError(400, "User with this email or username already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        fullName,
        username,
        email,
        password: hashedPassword,
        role,
    });

    if (role === "jobseeker") {
        await JobSeeker.create({ user: newUser._id });
    } else if (role === "recruiter") {
        await Recruiter.create({ user: newUser._id });
    }

    const payload = { id: newUser._id, role: newUser.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    const userToReturn = {
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        phone: newUser.phone,
        location: newUser.location,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
    };

    return sendResponse(
        res,
        new ApiResponse(201, {
            message: "User registered successfully",
            token,
            user: userToReturn,
        }),
    );
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Please provide email and password");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid email or password");
    }

    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    const userToReturn = {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        location: user.location,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };

    return sendResponse(
        res,
        new ApiResponse(200, {
            message: "Login successful",
            token,
            user: userToReturn,
        }),
    );
};

const logoutUser = async (req, res) => {
    return sendResponse(res, new ApiResponse(200, { message: "Logged out successfully" }));
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail({
        email: user.email,
        subject: "Password Reset OTP",
        mailgenContent: forgotPasswordOTPContent(user.fullName, otp),
    });

    return sendResponse(res, new ApiResponse(200, { message: "OTP sent to your email" }));
};

const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        throw new ApiError(400, "Email and OTP are required");
    }

    const user = await User.findOne({ email });
    if (
        !user ||
        user.resetPasswordOTP !== otp ||
        user.resetPasswordExpires < Date.now()
    ) {
        throw new ApiError(400, "Invalid or expired OTP");
    }

    return sendResponse(res, new ApiResponse(200, { message: "OTP verified successfully" }));
};

const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        throw new ApiError(400, "Email and new password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return sendResponse(res, new ApiResponse(200, { message: "Password reset successful" }));
};

export {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    verifyOTP,
    resetPassword,
};
