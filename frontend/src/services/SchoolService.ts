import { useApi } from '../hooks/useApi';
import { ClassroomRequest, ClassroomResponse } from '../models/Classroom';
import type { SchoolClassroomDto, SchoolDto, SchoolRequest } from '../models/School';

export const useSchoolService = () => {
  const api = useApi();

  return {
    async getAll(): Promise<SchoolDto[]> {
      const response = await api.get<SchoolDto[]>('/schools');
      return response.data;
    },

    async getAllClassrooms(schoolId: number): Promise<SchoolClassroomDto[]> {
      const response = await api.get<SchoolClassroomDto[]>(`/schools/${schoolId}/classrooms`);
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

    async createClassroom(schoolId: number, data: ClassroomRequest): Promise<ClassroomResponse> {
        try {
          const response = await api.post<ClassroomResponse>(`/schools/${schoolId}/classrooms`, data);
          return response.data;
        } catch (err) {
          console.error('Failed to create classroom:', err);
          throw new Error('Failed to create classroom');
        }
    },

    async update(id: number, school: SchoolRequest): Promise<void> {
      await api.put(`/schools/${id}`, school);
    },

    async delete(id: number): Promise<void> {
      await api.delete(`/schools/${id}`);
    },

  };
};