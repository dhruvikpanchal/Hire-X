import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import jobSeekerRoutes from "./routes/jobSeekerRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import chatRequestRoutes from "./routes/chatRequestRoutes.js";
import friendsRoutes from "./routes/friendsRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express()

app.use("/uploads", express.static("uploads"));

// middlewares 
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser())

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobseekers", jobSeekerRoutes);
app.use("/api/recruiters", recruiterRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chat-request", chatRequestRoutes);
app.use("/api/friends", friendsRoutes);

app.use(errorHandler);

export { app }