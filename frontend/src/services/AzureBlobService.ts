import { useApi } from '../hooks/useApi';

export const useAzureBlobService = () => {
  const api = useApi();

  return {
    async upload(container: string, file: File): Promise<string> {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post<{ blobName: string; container: string }>(
        `/blob/upload?container=${container}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      return response.data.blobName;
    },

    async getSasUrl(container: string, blobName: string): Promise<string> {
      const response = await api.get<{ url: string }>(
        `/blob/sas?container=${container}&blobName=${blobName}`
      );
      return response.data.url;
    },

    async delete(container: string, blobName: string): Promise<void> {
      await api.delete(`/blob?container=${container}&blobName=${blobName}`);
    },
  };
};