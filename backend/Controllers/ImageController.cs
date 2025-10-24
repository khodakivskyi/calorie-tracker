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
            //try

            var image = await _imageService.SaveImageAsync(file, userId);

            return Ok(new
            {
                imageId = image.Id,
                url = image.Url,
                fileName = image.FileName
            });
        }
    }
}
