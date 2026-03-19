import { sendEmail, forgotPasswordOTPContent } from "../utils/mail.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import JobSeeker from "../models/JobSeeker.js";
import Recruiter from "../models/Recruiter.js";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { fullName, username, email, password, role } = req.body;

        // 1. Validate required fields
        if (!fullName || !username || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        // Validate role
        if (!["jobseeker", "recruiter"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role. Must be 'jobseeker' or 'recruiter'",
            });
        }

        // 2. Check if user already exists
        const userExists = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User with this email or username already exists",
            });
        }

        // 3. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create new User document
        const newUser = await User.create({
            fullName,
            username,
            email,
            password: hashedPassword,
            role,
        });

        // 5. Based on role, create empty profiles
        if (role === "jobseeker") {
            await JobSeeker.create({
                user: newUser._id,
            });
        } else if (role === "recruiter") {
            await Recruiter.create({
                user: newUser._id,
            });
        }

        // 6. Generate JWT token
        const payload = {
            id: newUser._id,
            role: newUser.role,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        // Prepare user data to return (exclude password)
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

        // 7. Return success response
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: userToReturn,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error during registration",
            error: error.message,
        });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password",
            });
        }

        // 1. Find user by email
        const user = await User.findOne({ email });

        // 2. If user not found
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // 3 & 4. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // 5. Generate JWT token
        const payload = {
            id: user._id,
            role: user.role,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        // Prepare user data to return (exclude password)
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

        // 6. Return response
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: userToReturn,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error during login",
            error: error.message,
        });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private/Public depending on implementation
const logoutUser = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error during logout",
            error: error.message,
        });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 min

        await user.save();

        // Send Email
        await sendEmail({
            email: user.email,
            subject: "Password Reset OTP",
            mailgenContent: forgotPasswordOTPContent(user.fullName, otp),
        });

        res.status(200).json({
            success: true,
            message: "OTP sent to your email",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in forgot password",
            error: error.message,
        });
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required",
            });
        }

        const user = await User.findOne({ email });

        if (
            !user ||
            user.resetPasswordOTP !== otp ||
            user.resetPasswordExpires < Date.now()
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP",
            });
        }

        res.status(200).json({
            success: true,
            message: "OTP verified successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error verifying OTP",
            error: error.message,
        });
    }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email and new password are required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successful",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error resetting password",
            error: error.message,
        });
    }
};

export {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    verifyOTP,
    resetPassword,
};
