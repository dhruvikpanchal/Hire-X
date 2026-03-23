import axiosInstance from "./apiService.js";

export const getConversations = async () => {
  const res = await axiosInstance.get("/messages/conversations");
  return res.data;
};

export const getMessagesByConversation = async (conversationId) => {
  const res = await axiosInstance.get(`/messages/conversations/${conversationId}`);
  return res.data;
};

export const sendMessage = async ({ receiverId, content, conversationId, jobId }) => {
  const res = await axiosInstance.post("/messages/send", {
    receiverId,
    content,
    conversationId,
    jobId,
  });
  return res.data;
};

export const blockUser = async (blockedUserId) => {
  const res = await axiosInstance.post("/messages/block", { blockedUserId });
  return res.data;
};

export const unblockUser = async (blockedUserId) => {
  const res = await axiosInstance.post("/messages/unblock", { blockedUserId });
  return res.data;
};

export const getBlockedUsers = async () => {
  const res = await axiosInstance.get("/messages/blocked");
  return res.data;
};

