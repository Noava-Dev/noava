import { useApi } from "../hooks/useApi"; 
import type { ClerkUserResponse } from "../models/User"; 

export const userService = () => {
  const api = useApi();

  const getUsers = async (): Promise<ClerkUserResponse[]> => {
    try {
      const response = await api.get<ClerkUserResponse[]>("/users");
      return response.data;
    } catch (err) {
      console.error("Error fetching users:", err);
      throw new Error("Failed to fetch users list");
    }
  };

  const deleteUser = async (clerkId: string): Promise<void> => {
    try {
      await api.delete(`/users/${clerkId}`);
    } catch (err) {
      console.error(`Error deleting user ${clerkId}:`, err);
      throw new Error("Failed to delete user");
    }
  };

  return { getUsers, deleteUser };
};