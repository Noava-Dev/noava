import { useApi } from '../hooks/useApi';

export const useAzureBlobService = () => {
  const api = useApi();

  return {
    async uploadImage(file: File): Promise<string> {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post<{ blobName: string }>('/blob/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.blobName;
    },

    async getBlobSasUrl(blobName: string): Promise<string> {
      const response = await api.get<{ url: string }>(`/blob/sas?blobName=${blobName}`);
      return response.data.url;
    },
  };
};