using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IImageRepository
    {
        Task<Image?> GetImageByIdAsync(int imageId);
        Task<IEnumerable<Image>> GetImagesByOwnerAsync(int ownerId);
        Task<Image?> CreateImageAsync(Image image);
        Task<Image?> UpdateImageAsync(Image image);
        Task<bool> DeleteImageAsync(int imageId, int ownerId);
        Task<bool> DeleteAllImagesByOwnerAsync(int ownerId);
    }
}
