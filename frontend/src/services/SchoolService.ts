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

    async create(school: SchoolRequest): Promise<SchoolDto> {
      const response = await api.post<SchoolDto>('/schools', school);
      return response.data;
    },

    async update(id: number, school: SchoolRequest): Promise<void> {
      await api.put(`/schools/${id}`, school);
    },

    async delete(id: number): Promise<void> {
      await api.delete(`/schools/${id}`);
    },

  };
};