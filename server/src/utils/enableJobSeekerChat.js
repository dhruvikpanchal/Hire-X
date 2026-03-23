import ChatRequest from "../models/ChatRequest.js";
import Message, { Conversation } from "../models/Message.js";

const normalizePairQuery = (a, b) => ({
  $or: [
    { sender: a, receiver: b },
    { sender: b, receiver: a },
  ],
});

/**
 * Ensure ChatRequest is accepted and a DM conversation exists (job: null).
 * Used when job seekers become friends.
 */
export async function enableChatBetween(userA, userB) {
  let reqDoc = await ChatRequest.findOne(normalizePairQuery(userA, userB));
  if (!reqDoc) {
    reqDoc = await ChatRequest.create({
      sender: userA,
      receiver: userB,
      status: "accepted",
    });
  } else {
    reqDoc.status = "accepted";
    await reqDoc.save();
  }

  const existingConvo = await Conversation.findOne({
    participants: { $all: [userA, userB] },
    job: null,
  });
  if (!existingConvo) {
    await Conversation.create({
      participants: [userA, userB],
      job: null,
      lastMessage: null,
    });
  }
}

/**
 * Remove chat ability between two users: delete ChatRequest pair and DM conversation + messages.
 */
export async function disableChatBetween(userA, userB) {
  await ChatRequest.deleteMany(normalizePairQuery(userA, userB));

  const convos = await Conversation.find({
    participants: { $all: [userA, userB] },
    job: null,
  }).lean();

  for (const c of convos) {
    await Message.deleteMany({ conversation: c._id });
    await Conversation.deleteOne({ _id: c._id });
  }
}
