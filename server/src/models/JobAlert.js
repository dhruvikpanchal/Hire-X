import mongoose from "mongoose"

const jobAlertSchema = new mongoose.Schema(
    {
        seeker: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        keywords: [
            {
                type: String,
                trim: true
            }
        ],

        location: {
            type: String,
            default: ""
        },

        jobType: {
            type: String,
            default: ""
        },

        frequency: {
            type: String,
            enum: ["daily", "weekly", "instant"],
            default: "daily"
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model("JobAlert", jobAlertSchema)