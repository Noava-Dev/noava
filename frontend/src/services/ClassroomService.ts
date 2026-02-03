import type { ClassroomRequest, ClassroomResponse } from '../models/Classroom';
import type { ClerkUserResponse } from '../models/User';
import { useApi } from '../hooks/useApi';

export const useClassroomService = () => {
  const api = useApi();

  const create = async (data: ClassroomRequest): Promise<ClassroomResponse> => {
    try {
      const response = await api.post<ClassroomResponse>('/classrooms', data);
      return response.data;
    } catch (err) {
      console.error('Failed to create classroom:', err);
      throw new Error('Failed to create classroom');
    }
  };

  const getAllForUser = async (): Promise<ClassroomResponse[]> => {
    try {
      const response = await api.get<ClassroomResponse[]>('/classrooms');
      return response.data;
    } catch (err) {
      console.error('Failed to fetch classrooms:', err);
      throw new Error('Failed to fetch classrooms');
    }
  };

  const getById = async (id: number): Promise<ClassroomResponse> => {
    try {
      const response = await api.get<ClassroomResponse>(`/classrooms/${id}`);
      return response.data;
    } catch (err) {
      console.error(`Failed to fetch classroom with id ${id}:`, err);
      throw new Error('Failed to fetch classroom');
    }
  };

  const joinByCode = async (joinCode: string): Promise<ClassroomResponse> => {
    try {
      const response = await api.post<ClassroomResponse>(
        `/classrooms/join/${joinCode}`
      );
      return response.data;
    } catch (err) {
      console.error(`Failed to join classroom with code ${joinCode}:`, err);
      throw new Error('Failed to join classroom');
    }
  };

  const update = async (
    id: number,
    data: ClassroomRequest
  ): Promise<ClassroomResponse> => {
    try {
      const response = await api.put<ClassroomResponse>(
        `/classrooms/${id}`,
        data
      );
      return response.data;
    } catch (err) {
      console.error(`Failed to update classroom with id ${id}:`, err);
      throw new Error('Failed to update classroom');
    }
  };

  const deleteClassroom = async (id: number): Promise<ClassroomResponse> => {
    try {
      const response = await api.delete<ClassroomResponse>(`/classrooms/${id}`);
      return response.data;
    } catch (err) {
      console.error(`Failed to delete classroom with id ${id}:`, err);
      throw new Error('Failed to delete classroom');
    }
  };

  const updateJoinCode = async (id: number): Promise<ClassroomResponse> => {
    try {
      const response = await api.put<ClassroomResponse>(
        `/classrooms/${id}/joincode`
      );
      return response.data;
    } catch (err) {
      console.error(
        `Failed to update join code for classroom with id ${id}:`,
        err
      );
      throw new Error('Failed to update join code');
    }
  };

  const getUsersByClassroom = async (
    id: number,
    page = 1,
    pageSize = 50
  ): Promise<ClerkUserResponse[]> => {
    try {
      const response = await api.get<ClerkUserResponse[]>(
        `/classrooms/${id}/users`,
        { params: { page, pageSize } }
      );
      return response.data;
    } catch (err) {
      console.error(`Failed to fetch users for classroom with id ${id}:`, err);
      throw new Error('Failed to fetch classroom users');
    }
  };

  const removeUser = async (
    classroomId: number,
    targetUserId: string
  ): Promise<ClassroomResponse> => {
    try {
      const response = await api.delete<ClassroomResponse>(
        `/classrooms/${classroomId}/users/${targetUserId}`
      );
      return response.data;
    } catch (err) {
      console.error(
        `Failed to remove user ${targetUserId} from classroom ${classroomId}:`,
        err
      );
      throw new Error('Failed to remove user from classroom');
    }
  };

  const setUserRole = async (
    classroomId: number,
    targetUserId: string,
    isTeacher: boolean
  ): Promise<ClassroomResponse> => {
    try {
      const response = await api.put<ClassroomResponse>(
        `/classrooms/${classroomId}/users/${targetUserId}/role`,
        null,
        { params: { isTeacher } }
      );
      return response.data;
    } catch (err) {
      console.error(
        `Failed to set role for user ${targetUserId} in classroom ${classroomId}:`,
        err
      );
      throw new Error('Failed to set user role');
    }
  };

  const inviteByEmail = async (
    classroomId: number,
    email: string
  ): Promise<ClassroomResponse> => {
    try {
      const response = await api.post<ClassroomResponse>(
        `/classrooms/${classroomId}/invite`,
        null,
        { params: { email } }
      );
      return response.data;
    } catch (err) {
      console.error(
        `Failed to invite user ${email} to classroom ${classroomId}:`,
        err
      );
      throw new Error('Failed to invite user to classroom');
    }
  };

  return {
    create,
    getAllForUser,
    getById,
    joinByCode,
    getUsersByClassroom,
    update,
    delete: deleteClassroom,
    updateJoinCode,
    removeUser,
    setUserRole,
    inviteByEmail,
  };
};
