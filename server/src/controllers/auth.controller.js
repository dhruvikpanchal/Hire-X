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
        if (!["jobseeker", "employer"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role. Must be 'jobseeker' or 'employer'",
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
        } else if (role === "employer") {
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

export {
    registerUser,
    loginUser,
    logoutUser
};
