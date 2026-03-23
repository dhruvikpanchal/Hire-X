import axiosInstance from "./apiService.js";

export const getFriends = async () => {
  const res = await axiosInstance.get("/friends");
  return res.data;
};

export const sendFriendRequest = async (friendId) => {
  const res = await axiosInstance.post("/friends/request", { friendId });
  return res.data;
};

export const acceptFriendRequest = async (requestId) => {
  const res = await axiosInstance.post("/friends/accept", { requestId });
  return res.data;
};

export const removeFriend = async (friendUserId) => {
  const res = await axiosInstance.delete(`/friends/${friendUserId}`);
  return res.data;
};
