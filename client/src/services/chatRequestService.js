import axiosInstance from "./apiService.js";

export const getMyChatRequests = async () => {
  const res = await axiosInstance.get("/chat-request");
  return res.data;
};

export const sendChatRequest = async (userId) => {
  const res = await axiosInstance.post(`/chat-request/send/${userId}`);
  return res.data;
};

export const acceptChatRequest = async (id) => {
  const res = await axiosInstance.post(`/chat-request/accept/${id}`);
  return res.data;
};

export const rejectChatRequest = async (id) => {
  const res = await axiosInstance.post(`/chat-request/reject/${id}`);
  return res.data;
};

export const searchUsers = async (q) => {
  const res = await axiosInstance.get("/users/search", { params: { q } });
  return res.data;
};

