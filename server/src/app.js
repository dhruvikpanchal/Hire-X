import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import jobSeekerRoutes from "./routes/jobSeekerRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";

const app = express()

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

export { app }