import type { ClassroomRequest, ClassroomResponse } from "../models/Classroom";
import { useApi } from "../hooks/useApi";

export const classroomService = () => {
  const api = useApi();

  const create = async (data: ClassroomRequest): Promise<ClassroomResponse> => {
    try {
      const response = await api.post<ClassroomResponse>("/classrooms", data);
      return response.data;
    } catch (err) {
      console.error("Failed to create classroom:", err);
      throw new Error("Failed to create classroom");
    }
  };

  const getAllForUser = async (): Promise<ClassroomResponse[]> => {
    try {
      const response = await api.get<ClassroomResponse[]>("/classrooms");
      return response.data;
    } catch (err) {
      console.error("Failed to fetch classrooms:", err);
      throw new Error("Failed to fetch classrooms");
    }
  };

  const getById = async (id: number): Promise<ClassroomResponse> => {
    try {
      const response = await api.get<ClassroomResponse>(`/classrooms/${id}`);
      return response.data;
    } catch (err) {
      console.error(`Failed to fetch classroom with id ${id}:`, err);
      throw new Error("Failed to fetch classroom");
    }
  };

  const joinByCode = async (joinCode: string): Promise<ClassroomResponse> => {
    try {
      const response = await api.post<ClassroomResponse>(`/classrooms/join/${joinCode}`);
      return response.data;
    } catch (err) {
      console.error(`Failed to join classroom with code ${joinCode}:`, err);
      throw new Error("Failed to join classroom");
    }
  };

  const update = async (id: number, data: ClassroomRequest): Promise<ClassroomResponse> => {
    try {
      const response = await api.put<ClassroomResponse>(`/classrooms/${id}`, data);
      return response.data;
    } catch (err) {
      console.error(`Failed to update classroom with id ${id}:`, err);
      throw new Error("Failed to update classroom");
    }
  };

  const deleteClassroom = async (id: number): Promise<ClassroomResponse> => {
    try {
      const response = await api.delete<ClassroomResponse>(`/classrooms/${id}`);
      return response.data;
    } catch (err) {
      console.error(`Failed to delete classroom with id ${id}:`, err);
      throw new Error("Failed to delete classroom");
    }
  };

  const updateJoinCode = async (id: number): Promise<ClassroomResponse> => {
    try {
      const response = await api.put<ClassroomResponse>(`/classrooms/${id}/joincode`);
      return response.data;
    } catch (err) {
      console.error(`Failed to update join code for classroom with id ${id}:`, err);
      throw new Error("Failed to update join code");
    }
  };

  return {
    create,
    getAllForUser,
    getById,
    joinByCode,
    update,
    delete: deleteClassroom,
    updateJoinCode,
  };
};