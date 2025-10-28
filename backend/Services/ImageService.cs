using backend.Exceptions;
using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.Extensions.Options;

namespace backend.Services
{
    public class ImageService
    {
        private readonly IImageRepository _imageRepository;
        private readonly IWebHostEnvironment _environment;
        private readonly ImageSettings _imageSettings;

        public ImageService(IImageRepository imageRepository, IWebHostEnvironment environment, IOptions<ImageSettings> imageSettings)
        {
            _imageRepository = imageRepository;
            _environment = environment;
            _imageSettings = imageSettings.Value;
        }

        public async Task<Image> GetImageByIdAsync(int imageId)
        {
            var image = await _imageRepository.GetImageByIdAsync(imageId);
            if (image == null)
            {
                throw new NotFoundException("Image not found");
            }
            return image;
        }

        public async Task<IEnumerable<Image>> GetImagesByUserAsync(int userId)
        {
            return await _imageRepository.GetImagesByUserAsync(userId);
        }

        public async Task<Image> SaveImageAsync(IFormFile file, int userId)
        {
            ValidateFile(file);

            var uniqueFileName = GenerateUniqueFileName(file.FileName);

            var userFolder = CreateUserFolder(userId);
            var filePath = Path.Combine(userFolder, uniqueFileName);
            
            try
            {
                await SaveFileToDisk(file, filePath);
                
                var url = $"/images/users/{userId}/{uniqueFileName}";
                var image = new Image(userId, file.FileName, url);
                var createdImage = await _imageRepository.CreateImageAsync(image);

                if (createdImage == null)
                {
                    DeleteFileFromDisk(filePath);
                    throw new Exception("Failed to save image to database");
                }

                return createdImage;
            }
            catch
            {
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }
                throw;
            }
        }
        public async Task<Image> UpdateImageAsync(IFormFile newFile, int userId, int oldImageId)
        {
            var oldImage = await _imageRepository.GetImageByIdAsync(oldImageId);
            if (oldImage == null)
                throw new NotFoundException("Image not found");

            if (oldImage.OwnerId != userId)
                throw new ForbiddenException("You don't have permission to update this image");

            ValidateFile(newFile);

            var uniqueFileName = GenerateUniqueFileName(newFile.FileName);
            var userFolder = CreateUserFolder(userId);
            var newFilePath = Path.Combine(userFolder, uniqueFileName);
            var oldFilePath = Path.Combine(_environment.WebRootPath, oldImage.Url.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
            
            try
            {
                await SaveFileToDisk(newFile, newFilePath);
                
                var newUrl = $"/images/users/{userId}/{uniqueFileName}";
                oldImage.FileName = newFile.FileName;
                oldImage.Url = newUrl;

                var updatedImage = await _imageRepository.UpdateImageAsync(oldImage);
                if (updatedImage == null)
                {
                    DeleteFileFromDisk(newFilePath);
                    throw new NotFoundException("Failed to update image");
                }

                DeleteFileFromDisk(oldImage.Url);

                return updatedImage;
            }
            catch
            {
                if (File.Exists(newFilePath))
                {
                    File.Delete(newFilePath);
                }
                throw;
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


 
        private void ValidateFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ValidationException("File is empty");

            if (!IsValidImageType(file))
                throw new ValidationException("Invalid file type. Only jpg, png, and webp are allowed.");

            if (file.Length > _imageSettings.MaxFileSizeBytes)
                throw new ValidationException("File size exceeds 200KB limit");
        }

        private string GenerateUniqueFileName(string originalFileName)
        {
            var extension = Path.GetExtension(originalFileName).ToLowerInvariant();
            return $"{Guid.NewGuid():N}{extension}";
        }

        private string CreateUserFolder(int userId)
        {
            var userFolder = Path.Combine(_environment.WebRootPath, "images", "users", userId.ToString());
            if (!Directory.Exists(userFolder))
            {
                Directory.CreateDirectory(userFolder);
                if (!Directory.Exists(userFolder))
                {
                    throw new Exception($"Failed to create user folder: {userFolder}");
                }
            }
            return userFolder;
        }

        private async Task SaveFileToDisk(IFormFile file, string filePath)
        {
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
        }

        private void DeleteFileFromDisk(string url)
        {
            var filePath = Path.Combine(_environment.WebRootPath, url.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }

        private bool IsValidImageType(IFormFile file)
        {
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            return _imageSettings.AllowedExtensions.Contains(extension);
        }
    }
}