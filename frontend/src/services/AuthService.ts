import { useApi } from "../hooks/useApi";
import type { User } from "../models/User";

export const authService = () => {
  const api = useApi();

  const getMe = async (): Promise<User> => {
    try {
      const response = await api.get<User>("/users/me");
      return response.data;
    } catch (err) {
      throw new Error("Failed to fetch me endpoint");
    }
  };

  return { getMe };
};