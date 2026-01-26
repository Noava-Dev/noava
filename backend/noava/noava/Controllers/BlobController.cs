using Microsoft.AspNetCore.Mvc;
using noava.Shared;
using noava.Models.BlobStorage;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;

namespace noava.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlobController : ControllerBase
    {
        private readonly IBlobService _blobService;
        private const string DeckImagesContainer = "deck-images";

        public BlobController(IBlobService blobService)
        {
            _blobService = blobService;
        }

        // POST: api/blob/upload
        [HttpPost("upload")]
        public async Task<ActionResult> UploadDeckImage(IFormFile file)
        {
            Console.WriteLine("========== UPLOAD REQUEST ==========");
            Console.WriteLine($"File: {file?.FileName}");

            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest(new { error = "No file" });

                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

                if (!allowedExtensions.Contains(extension))
                    return BadRequest(new { error = "Invalid file type" });

                if (file.Length > 5 * 1024 * 1024)
                    return BadRequest(new { error = "File too large" });

                Console.WriteLine("Creating container...");
                var container = await _blobService.EnsureContainer(new EnsureContainerRequest
                {
                    ContainerName = DeckImagesContainer,
                    AccessType = PublicAccessType.None  // Private
                });

                var blobName = $"{Guid.NewGuid()}{extension}";
                Console.WriteLine($"Uploading: {blobName}");

                await _blobService.SaveFile(new SaveFileRequest
                {
                    Container = container,
                    BlobName = blobName,
                    FormFile = file
                });

                Console.WriteLine("✅ Upload success!");
                return Ok(new { blobName });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ ERROR: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // GET: api/blob/sas?blobName=xxx
        [HttpGet("sas")]
        public ActionResult GetBlobSasUrl([FromQuery] string blobName)
        {
            if (string.IsNullOrEmpty(blobName))
            {
                return BadRequest(new { error = "BlobName required" });
            }

            try
            {
                var sasUrl = _blobService.GetFileSas(new GetFileSasRequest
                {
                    ContainerName = DeckImagesContainer,
                    BlobName = blobName,
                    Permission = BlobSasPermissions.Read
                });

                return Ok(new { url = sasUrl });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ SAS ERROR: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}