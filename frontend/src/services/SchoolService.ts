import { useApi } from '../hooks/useApi';
import type { SchoolDto, CreateSchoolRequest } from '../models/School';

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

    async create(school: CreateSchoolRequest): Promise<SchoolDto> {
      const response = await api.post<SchoolDto>('/schools', school);
      return response.data;
    },

    async delete(id: number): Promise<void> {
      await api.delete(`/schools/${id}`);
    }
  };
};