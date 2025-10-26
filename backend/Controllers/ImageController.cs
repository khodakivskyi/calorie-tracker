using backend.Exceptions;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImageController : ControllerBase
    {
        public readonly ImageService _imageService;

        public ImageController(ImageService imageService)
        {
            _imageService = imageService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] IFormFile file, [FromForm] int userId)
        {
            try
            {
                var image = await _imageService.SaveImageAsync(file, userId);

                return Ok(new
                {
                    imageId = image.Id,
                    url = image.Url,
                    fileName = image.FileName
                });
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("update")]
        public async Task<IActionResult> Update([FromForm] IFormFile file, [FromForm] int userId, [FromForm] int oldImageId)
        {
            try
            {
                var image = await _imageService.UpdateImageAsync(file, userId, oldImageId);

                return Ok(new
                {
                    imageId = image.Id,
                    url = image.Url,
                    fileName = image.FileName
                });
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("delete")]
        public async Task<IActionResult> Delete([FromForm] int imageId, [FromForm] int userId)
        {
            try
            {
                var success = await _imageService.DeleteImageAsync(imageId, userId);

                if (success)
                {
                    return Ok(new { message = "Image deleted successfully" });
                }
                else
                {
                    return StatusCode(500, "Failed to delete image");
                }
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (ForbiddenException ex)
            {
                return StatusCode(403, ex.Message);
            }
            catch (NotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserImages(int userId)
        {
            try
            {
                var images = await _imageService.GetImagesByOwnerAsync(userId);
                return Ok(images);
            }
            catch
            {
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
