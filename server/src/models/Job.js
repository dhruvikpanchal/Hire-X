import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema(
    {
        recruiter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        jobTitle: {
            type: String,
            required: true,
            trim: true
        },

        company: {
            type: String,
            required: true,
            trim: true
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        jobType: {
            type: String,
            enum: [
                "Full-time",
                "Part-time",
                "Remote",
                "Hybrid",
                "Internship",
                "Contract"
            ],
            required: true
        },

        salaryMin: {
            type: Number,
            default: null
        },

        salaryMax: {
            type: Number,
            default: null
        },

        description: {
            type: String,
            required: true
        },

        responsibilities: {
            type: String,
            required: true
        },

        skills: [
            {
                type: String
            }
        ],

        experience: {
            type: String,
            required: true
        },

        education: {
            type: String,
            default: "No Requirement"
        },

        status: {
            type: String,
            enum: ["active", "expired", "draft"],
            default: "active"
        },

        applicants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Application"
            }
        ]
    },
    {
        timestamps: true
    }
);

// Index for fast job search queries
jobSchema.index({ jobTitle: "text", description: "text", skills: "text" });
jobSchema.index({ location: 1 });
jobSchema.index({ jobType: 1 });
jobSchema.index({ recruiter: 1 });
export default mongoose.model("Job", jobSchema);