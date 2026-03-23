import mongoose from "mongoose";

const recruiterPostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
  },
  { timestamps: true },
);

recruiterPostSchema.index({ createdAt: -1 });

export default mongoose.model("RecruiterPost", recruiterPostSchema);
