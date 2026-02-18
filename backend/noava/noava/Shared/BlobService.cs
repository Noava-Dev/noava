using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;
using noava.Models.BlobStorage;
using noava.Models.Requests;
using System.ComponentModel;

namespace noava.Shared
{
    public class BlobService(IConfiguration configuration) : IBlobService
    {
        private readonly string _connectionString = configuration.GetConnectionString("AzureBlobStorage");

        private async Task<BlobContainerClient?> TryGetExistingContainerAsync(string containerName)
        {
            var blobServiceClient = new BlobServiceClient(_connectionString);
            var container = blobServiceClient.GetBlobContainerClient(containerName);
            return await container.ExistsAsync() ? container : null;
        }

        private async Task<BlobContainerClient> CreateContainerAsync(string containerName, PublicAccessType accessType = PublicAccessType.None)
        {
            var blobServiceClient = new BlobServiceClient(_connectionString);
            var container = blobServiceClient.GetBlobContainerClient(containerName);
            await container.CreateIfNotExistsAsync(accessType);
            return container;
        }

        private async Task<string> CreateBlob(BlobContainerClient container, string blobName, IFormFile formFile)
        {
            BlobClient blobClient = container.GetBlobClient(blobName);
            using var stream = formFile.OpenReadStream();
            //using var stream = new MemoryStream();
            //await formFile.CopyToAsync(stream);
            //stream.Position = 0;
            var blobHttpHeaders = new BlobHttpHeaders
            {
                ContentType = formFile.ContentType ?? "application/octet-stream"
            };

            var uploadOptions = new BlobUploadOptions
            {
                HttpHeaders = blobHttpHeaders
            };

            var upload = await blobClient.UploadAsync(stream, uploadOptions);
            return blobClient.Uri.AbsoluteUri;
        }

        private async Task DeleteBlob(BlobContainerClient container, string blobName)
        {
            BlobClient blobClient = container.GetBlobClient(blobName);
            await blobClient.DeleteIfExistsAsync();
        }

        public async Task<BlobContainerClient> EnsureContainer(EnsureContainerRequest request)
        {
            var container = await TryGetExistingContainerAsync(request.ContainerName);
            if (container != null)
            {
                return container;
            }
            return await CreateContainerAsync(request.ContainerName, request.AccessType);
        }

        public async Task SaveFile(SaveFileRequest request)
        {
            await CreateBlob(request.Container, request.BlobName, request.FormFile);
        }

        public async Task DeleteFile(DeleteFileRequest request)
        {
            var container = await TryGetExistingContainerAsync(request.ContainerName);
            if (container == null)
            {
                return;
            }
            await DeleteBlob(container, request.BlobName);
        }

        public string GetFileSas(GetFileSasRequest request)
        {
            BlobClient blobClient = new BlobClient(_connectionString, request.ContainerName, request.BlobName);
            BlobSasBuilder sasBuilder = new()
            {
                BlobName = request.BlobName,
                Resource = "b",
                ExpiresOn = DateTimeOffset.UtcNow.AddMinutes(5),
            };

            sasBuilder.SetPermissions(request.Permission);
            return blobClient.GenerateSasUri(sasBuilder).ToString();
        }

        public string GetContainerSas(GetContainerSasRequest request)
        {
            BlobContainerClient blobClient = new BlobContainerClient(_connectionString, request.ContainerName);
            BlobSasBuilder sasBuilder = new()
            {
                BlobContainerName = request.ContainerName,
                Resource = "c",
                ExpiresOn = DateTimeOffset.UtcNow.AddMinutes(5),
            };

            sasBuilder.SetPermissions(request.Permission);
            return blobClient.GenerateSasUri(sasBuilder).ToString();
        }

        public async Task CopyFile(CopyFileRequest request)
        {
            // get original blob
            var sourceBlob = request.Container.GetBlobClient(request.SourceBlobName);
            if (!await sourceBlob.ExistsAsync()) throw new InvalidOperationException("Source blob does not exist");

            var sasUrl = GetFileSas(new GetFileSasRequest
            {
                ContainerName = request.Container.Name,
                BlobName = request.SourceBlobName,
                Permission = BlobSasPermissions.Read,
            });

            // copy to destination with new blob name
            var destinationBlob = request.Container.GetBlobClient(request.DestinationBlobName);
            await destinationBlob.SyncCopyFromUriAsync(new Uri(sasUrl));
        }
    }
}
