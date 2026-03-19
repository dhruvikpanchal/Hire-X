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
        },

        experience: [
            {
                jobRole: { type: String, default: "" },
                companyName: { type: String, default: "" },
                startDate: { type: String, default: "" },
                endDate: { type: String, default: "" },
                currentlyWorking: { type: Boolean, default: false },
                description: { type: String, default: "" }
            }
        ],

        education: [
            {
                degree: { type: String, default: "" },
                institution: { type: String, default: "" },
                startYear: { type: String, default: "" },
                endYear: { type: String, default: "" }
            }
        ]

    },
    {
        timestamps: true
    });

export default mongoose.model("JobSeeker", jobSeekerSchema);