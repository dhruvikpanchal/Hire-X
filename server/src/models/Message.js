import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        conversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        content: {
            type: String,
            required: true,
            trim: true
        },

        isRead: {
            type: Boolean,
            default: false
        },

        deletedFor: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        deletedForEveryone: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const conversationSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: null
        },

        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            default: null
        }
    },
    {
        timestamps: true
    }
);

// prevent duplication
conversationSchema.index({ participants: 1, job: 1 });

// fast message loading
messageSchema.index({ conversation: 1 });

export default mongoose.model("Message", messageSchema)
export const Conversation = mongoose.model("Conversation", conversationSchema);