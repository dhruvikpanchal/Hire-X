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

export const deleteMessage = async ({ messageId, mode = "me" }) => {
  const res = await axiosInstance.delete(`/messages/${messageId}`, { params: { mode } });
  return res.data;
};

export const deleteAllMessages = async (conversationId) => {
  const res = await axiosInstance.delete(`/messages/conversations/${conversationId}/all`);
  return res.data;
};

export const clearConversationForMe = async (conversationId) => {
  const res = await axiosInstance.post(`/messages/conversations/${conversationId}/clear-me`);
  return res.data;
};

export const editMessage = async ({ messageId, content }) => {
  const res = await axiosInstance.patch(`/messages/${messageId}`, { content });
  return res.data;
};

