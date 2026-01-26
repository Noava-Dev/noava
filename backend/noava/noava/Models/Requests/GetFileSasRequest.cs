using Azure.Storage.Sas;

namespace noava.Models.BlobStorage
{
    public class GetFileSasRequest
    {
        public string ContainerName { get; set; } = null!;
        public string BlobName { get; set; } = null!;
        public BlobSasPermissions Permission { get; set; } = BlobSasPermissions.Read;
    }
}
