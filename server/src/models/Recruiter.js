import mongoose from "mongoose";

const recruiterSchema = new mongoose.Schema(
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

        companyName: {
            type: String,
            default: ""
        },

        companyLogo: {
            type: String,
            default: ""
        },

        industry: {
            type: String,
            default: ""
        },

        companySize: {
            type: String,
            default: ""
        },

        companyWebsite: {
            type: String,
            default: ""
        },

        companyDescription: {
            type: String,
            default: ""
        }

    },
    {
        timestamps: true
    });

export default mongoose.model("Recruiter", recruiterSchema);