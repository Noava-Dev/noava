import { useApi } from '../hooks/useApi';

export const useUserService = () => {
  const api = useApi();

  return {
    async getEmailPreferences(): Promise<boolean> {
      const response = await api.get<boolean>('/users/email-preferences');
      return response.data ?? false;
    },

    async updateEmailPreferences(receive: boolean): Promise<void> {
      await api.put('/users/email-preferences', receive);
    },
  };
};import { useApi } from "../hooks/useApi"; 
import type { ClerkUserResponse, UserRole } from "../models/User"; 

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

  const updateRole = async (clerkId: string, role: UserRole): Promise<void> => {
    try {
      await api.put(`/users/${clerkId}/role`, { role });
    } catch (err) {
      console.error(`Error updating role for user ${clerkId}:`, err);
      throw new Error("Failed to update user role");
    }
  };

  return { getUsers, deleteUser, updateRole };
};