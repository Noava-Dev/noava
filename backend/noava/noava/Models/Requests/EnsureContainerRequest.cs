using Azure.Storage.Blobs.Models;

namespace noava.Models.BlobStorage
{
    public class EnsureContainerRequest
    {
        public string ContainerName { get; set; } = null!;
        public PublicAccessType AccessType { get; set; } = PublicAccessType.None;
    }
}
