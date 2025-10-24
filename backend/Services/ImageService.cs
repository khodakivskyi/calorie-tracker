using backend.Exceptions;
using backend.Models;
using backend.Repositories.Interfaces;

namespace backend.Services
{
    public class ImageService
    {
        private readonly IImageRepository _imageRepository;
        private readonly IWebHostEnvironment _environment;

        public ImageService(IImageRepository imageRepository, IWebHostEnvironment environment)
        {
            _imageRepository = imageRepository;
            _environment = environment;
        }

        public async Task<Image> SaveImageAsync(IFormFile file, int userId)
        {
            ValidateFile(file);

            var uniqueFileName = GenerateUniqueFileName(file.FileName);

            var userFolder = CreateUserFolder(userId);

            var filePath = Path.Combine(userFolder, uniqueFileName);
            await SaveFileToDisk(file, filePath);

            var url = $"/images/users/{userId}/{uniqueFileName}";

            var image = new Image(userId, file.FileName, url);
            var createdImage = await _imageRepository.CreateImageAsync(image);

            return createdImage!;
        }

        private void ValidateFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ValidationException("File is empty");

            const long maxFileSize = 5 * 1024 * 1024;
            if (file.Length > maxFileSize)
                throw new ValidationException("File size exceeds 5MB limit");

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(extension))
                throw new ValidationException("Invalid file type. Only jpg, png, and webp are allowed.");
        }

        private string GenerateUniqueFileName(string originalFileName)
        {
            var extension = Path.GetExtension(originalFileName).ToLowerInvariant();
            return $"{Guid.NewGuid():N}{extension}";
        }

        private string CreateUserFolder(int userId)
        {
            var userFolder = Path.Combine(_environment.WebRootPath, "images", "users", userId.ToString());
            Directory.CreateDirectory(userFolder);
            return userFolder;
        }

        private async Task SaveFileToDisk(IFormFile file, string filePath)
        {
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
        }

        public async Task<bool> DeleteImageAsync(int imageId, int userId)
        {
            var image = await _imageRepository.GetImageByIdAsync(imageId);

            if (image == null)
                throw new NotFoundException("Image not found");

            if (image.OwnerId != userId)
                throw new ForbiddenException("You don't have permission to delete this image");

            DeleteFileFromDisk(image.Url);

            return await _imageRepository.DeleteImageAsync(imageId, userId);
        }

        private void DeleteFileFromDisk(string url)
        {
            var filePath = Path.Combine(_environment.WebRootPath, url.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }
    }
}