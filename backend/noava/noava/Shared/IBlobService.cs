using Azure.Storage.Blobs;
using noava.Models.BlobStorage;
using noava.Models.Requests;

namespace noava.Shared
{
    public interface IBlobService
    {
        Task<BlobContainerClient> EnsureContainer(EnsureContainerRequest request);
        Task SaveFile(SaveFileRequest request);
        Task DeleteFile(DeleteFileRequest request);
        string GetFileSas(GetFileSasRequest request);
        string GetContainerSas(GetContainerSasRequest request);
        Task CopyFile(CopyFileRequest request);
    }
}
