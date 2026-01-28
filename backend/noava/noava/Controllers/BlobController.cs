using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using noava.Shared;
using noava.Models.BlobStorage;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;

namespace noava.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BlobController : ControllerBase
    {
        private readonly IBlobService _blobService;
        private const string DeckImagesContainer = "deck-images";

        public BlobController(IBlobService blobService)
        {
            _blobService = blobService;
        }

        [HttpPost("upload")]
        public async Task<ActionResult> UploadDeckImage(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest(new { error = "No file uploaded" });

                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

                if (!allowedExtensions.Contains(extension))
                    return BadRequest(new { error = "Invalid file type" });

                if (file.Length > 5 * 1024 * 1024)
                    return BadRequest(new { error = "File too large (max 5MB)" });

                var container = await _blobService.EnsureContainer(new EnsureContainerRequest
                {
                    ContainerName = DeckImagesContainer,
                    AccessType = PublicAccessType.None
                });

                var blobName = $"{Guid.NewGuid()}{extension}";

                await _blobService.SaveFile(new SaveFileRequest
                {
                    Container = container,
                    BlobName = blobName,
                    FormFile = file
                });

                return Ok(new { blobName });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Upload failed" });
            }
        }

        [HttpGet("sas")]
        public ActionResult GetBlobSasUrl([FromQuery] string blobName)
        {
            if (string.IsNullOrEmpty(blobName))
                return BadRequest(new { error = "BlobName required" });

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
                return StatusCode(500, new { error = "Failed to generate SAS URL" });
            }
        }
    }
}