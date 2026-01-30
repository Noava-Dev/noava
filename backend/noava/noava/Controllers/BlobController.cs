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

        public BlobController(IBlobService blobService)
        {
            _blobService = blobService;
        }

        
        [HttpPost("upload")]
        public async Task<ActionResult> Upload([FromQuery] string container, IFormFile file)
        {
            try
            {
                if (string.IsNullOrEmpty(container))
                    return BadRequest(new { error = "Container name required" });

                if (file == null || file.Length == 0)
                    return BadRequest(new { error = "No file uploaded" });

                // Ensure container exists
                var containerClient = await _blobService.EnsureContainer(new EnsureContainerRequest
                {
                    ContainerName = container,
                    AccessType = PublicAccessType.None
                });

                // Generate unique blob name
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                var blobName = $"{Guid.NewGuid()}{extension}";

                // Upload file
                await _blobService.SaveFile(new SaveFileRequest
                {
                    Container = containerClient,
                    BlobName = blobName,
                    FormFile = file
                });

                return Ok(new { blobName, container });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Upload failed: {ex.Message}");
                return StatusCode(500, new { error = "Upload failed" });
            }
        }

        
        [HttpGet("sas")]
        public ActionResult GetSasUrl([FromQuery] string container, [FromQuery] string blobName)
        {
            try
            {
                if (string.IsNullOrEmpty(container))
                    return BadRequest(new { error = "Container name required" });

                if (string.IsNullOrEmpty(blobName))
                    return BadRequest(new { error = "BlobName required" });

                var sasUrl = _blobService.GetFileSas(new GetFileSasRequest
                {
                    ContainerName = container,
                    BlobName = blobName,
                    Permission = BlobSasPermissions.Read
                });

                return Ok(new { url = sasUrl });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"SAS generation failed: {ex.Message}");
                return StatusCode(500, new { error = "Failed to generate SAS URL" });
            }
        }

        
        [HttpDelete]
        public async Task<ActionResult> Delete([FromQuery] string container, [FromQuery] string blobName)
        {
            try
            {
                if (string.IsNullOrEmpty(container))
                    return BadRequest(new { error = "Container name required" });

                if (string.IsNullOrEmpty(blobName))
                    return BadRequest(new { error = "BlobName required" });

                await _blobService.DeleteFile(new DeleteFileRequest
                {
                    ContainerName = container,
                    BlobName = blobName
                });

                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Delete failed: {ex.Message}");
                return StatusCode(500, new { error = "Delete failed" });
            }
        }
    }
}