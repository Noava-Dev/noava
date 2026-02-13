import { useApi } from '../hooks/useApi';

// Helper to convert blob name TO backend format (for saving)
// Backend expects: {GUID}_{extension}
const toBackendFormat = (blobName: string): string => {
  if (!blobName) return blobName;
  
  // If already using underscore format, return as-is
  if (blobName.includes('_') && !blobName.includes('.')) {
    return blobName;
  }
  
  // Convert dot to underscore for the extension
  const lastDotIndex = blobName.lastIndexOf('.');
  if (lastDotIndex !== -1) {
    return blobName.substring(0, lastDotIndex) + '_' + blobName.substring(lastDotIndex + 1);
  }
  
  return blobName;
};

// Helper to convert blob name FROM backend format (for storage access)
// Storage has: {GUID}.{extension}, but backend stores: {GUID}_{extension}
const toStorageFormat = (blobName: string): string => {
  if (!blobName) return blobName;
  
  // If it has underscore but no dot, convert underscore to dot
  const lastUnderscoreIndex = blobName.lastIndexOf('_');
  if (lastUnderscoreIndex !== -1 && !blobName.includes('.')) {
    return blobName.substring(0, lastUnderscoreIndex) + '.' + blobName.substring(lastUnderscoreIndex + 1);
  }
  
  // Already in storage format or invalid
  return blobName;
};

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
      // Convert from backend format (uuid_ext) to storage format (uuid.ext)
      const storageBlobName = toStorageFormat(blobName);
      const response = await api.get<{ url: string }>(
        `/blob/sas?container=${container}&blobName=${storageBlobName}`
      );
      return response.data.url;
    },

    async delete(container: string, blobName: string): Promise<void> {
      // Convert from backend format (uuid_ext) to storage format (uuid.ext)
      const storageBlobName = toStorageFormat(blobName);
      await api.delete(`/blob?container=${container}&blobName=${storageBlobName}`);
    },
  };
};