namespace noava.Models.BlobStorage
{
    public class DeleteFileRequest
    {
        public string ContainerName { get; set; } = null!;
        public string BlobName { get; set; } = null!;
    }
}
