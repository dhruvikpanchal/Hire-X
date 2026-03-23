import mongoose from "mongoose";

/**
 * Connection requests between recruiters (same semantics as job seeker Friend model).
 */
const recruiterConnectionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    friendId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
    },
  },
  { timestamps: true },
);

recruiterConnectionSchema.index({ userId: 1, friendId: 1 }, { unique: true });

export default mongoose.model("RecruiterConnection", recruiterConnectionSchema);
