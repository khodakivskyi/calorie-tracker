using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IImageRepository
    {
        Task<Image> CreateImageAsync(Image image);
        Task<Image?> GetImageByIdAsync(int id);
        Task<IEnumerable<Image>> GetImagesByOwnerAsync(int ownerId);
        Task<bool> DeleteImageAsync(int id, int ownerId);
        Task<bool> DeleteAllImagesByOwnerAsync(int ownerId);
    }
}
