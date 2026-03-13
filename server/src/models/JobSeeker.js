import mongoose from "mongoose";

const jobSeekerSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        jobTitle: {
            type: String,
            default: ""
        },

        skills: [
            {
                type: String
            }
        ],

        bio: {
            type: String,
            default: ""
        },

        linkedin: {
            type: String,
            default: ""
        },

        portfolio: {
            type: String,
            default: ""
        },

        resumeUrl: {
            type: String,
            default: ""
        }

    },
    {
        timestamps: true
    });

export default mongoose.model("JobSeeker", jobSeekerSchema);