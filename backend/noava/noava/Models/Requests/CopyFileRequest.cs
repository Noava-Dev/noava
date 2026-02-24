using Azure.Storage.Blobs;

namespace noava.Models.Requests
{
    public class CopyFileRequest
    {
        public BlobContainerClient Container { get; set; } = null!;
        public string SourceBlobName { get; set; } = null!;
        public string DestinationBlobName { get; set;} = null!;
    }
}
