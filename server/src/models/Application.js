import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },

        seeker: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: ["applied", "viewed", "shortlisted", "interview", "offered", "rejected"],
            default: "applied"
        },

        coverLetter: {
            type: String,
            default: ""
        },

        resumeUrl: {
            url: String,
            publicId: String
        }
    },
    {
        timestamps: true
    }
);

applicationSchema.index({ job: 1, seeker: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);