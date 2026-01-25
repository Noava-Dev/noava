using Azure.Storage.Blobs;

namespace noava.Models.BlobStorage
{
    public class SaveFileRequest
    {
        public BlobContainerClient Container { get; set; } = null!;
        public string BlobName { get; set; } = null!;
        public IFormFile FormFile { get; set; } = null!;
    }
}
