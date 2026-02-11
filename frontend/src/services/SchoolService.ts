import { useApi } from '../hooks/useApi';
import type { SchoolDto, SchoolRequest } from '../models/School';

export const useSchoolService = () => {
  const api = useApi();

  return {


    async getAll(): Promise<SchoolDto[]> {
      const response = await api.get<SchoolDto[]>('/schools');
      return response.data;
    },

    async getById(id: number): Promise<SchoolDto> {
      const response = await api.get<SchoolDto>(`/schools/${id}`);
      return response.data;
    },

    async create(request: SchoolRequest): Promise<void> {
      await api.post('/schools', request);
    },

    async update(id: number, request: SchoolRequest): Promise<void> {
      await api.put(`/schools/${id}`, request);
    },

    async delete(id: number): Promise<void> {
      await api.delete(`/schools/${id}`);
    },

    // ----------------- ADMINS -----------------

    async addAdmin(schoolId: number, email: string): Promise<void> {
      await api.put(`/schools/${schoolId}/admins/${email}`);
    },

    async removeAdmin(schoolId: number, clerkId: string): Promise<void> {
      await api.delete(`/schools/${schoolId}/admins/${clerkId}`);
    }
  };
};
