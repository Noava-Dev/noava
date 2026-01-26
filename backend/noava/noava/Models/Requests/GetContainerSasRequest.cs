using Azure.Storage.Sas;

namespace noava.Models.BlobStorage
{
    public class GetContainerSasRequest
    {
        public string ContainerName { get; set; } = null!;
        public BlobSasPermissions Permission { get; set; } = BlobSasPermissions.Read;
    }
}
