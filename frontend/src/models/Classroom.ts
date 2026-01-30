export interface ClassroomRequest {
  name: string;
  description: string;
}

export interface ClassroomResponse {
  id: number;
  name: string;
  description: string;
  joinCode: string;
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
  };
  createdAt: string;
  updatedAt: string;
}