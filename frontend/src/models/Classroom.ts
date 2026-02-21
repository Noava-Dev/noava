export interface ClassroomRequest {
  name: string;
  description: string;
  coverImageBlobName?: string;
}

export interface ClassroomResponse {
  id: number;
  name: string;
  description: string;
  joinCode: string;
  coverImageBlobName: string | null;
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
  };
  createdAt: string;
  updatedAt: string;
}