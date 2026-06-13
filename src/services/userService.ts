import api from "../api/axios";
import { User, UpdateUserPayload } from "../types/user";

export const getUserProfile = async (): Promise<User> => {
  const response = await api.get<User>("/user/profile");
  return response.data;
};

export const updateUserProfile = async (data: UpdateUserPayload): Promise<User> => {
  const response = await api.put<User>("/user/profile", data);
  return response.data;
};

