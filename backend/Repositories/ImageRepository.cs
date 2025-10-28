using backend.Models;
using backend.Repositories.Interfaces;
using Dapper;
using Microsoft.Data.SqlClient;

namespace backend.Repositories
{
    public class ImageRepository : IImageRepository
    {
        private readonly string _connectionString;

        public ImageRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<Image?> GetImageByIdAsync(int imageId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                SELECT id, owner_id AS OwnerId, file_name AS FileName, 
                       url, created_at AS CreatedAt
                FROM images 
                WHERE id = @Id";

            return await connection.QuerySingleOrDefaultAsync<Image>(sql, new { Id = imageId });
        }

        public async Task<IEnumerable<Image>> GetImagesByUserAsync(int userId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                SELECT id, owner_id AS OwnerId, file_name AS FileName, 
                       url, created_at AS CreatedAt
                FROM images 
                WHERE owner_id = @UserId
                ORDER BY created_at DESC";

            return await connection.QueryAsync<Image>(sql, new { UserId = userId });
        }

        public async Task<Image?> CreateImageAsync(Image image)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                INSERT INTO images (owner_id, file_name, url)
                OUTPUT INSERTED.id, INSERTED.owner_id AS OwnerId, 
                       INSERTED.file_name AS FileName, INSERTED.url,
                       INSERTED.created_at AS CreatedAt
                VALUES (@OwnerId, @FileName, @Url)";

            return await connection.QuerySingleOrDefaultAsync<Image>(sql, image);
        }

        public async Task<Image?> UpdateImageAsync(Image image)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                UPDATE images
                    SET file_name = @FileName, url = @Url
                    WHERE id = @Id AND owner_id = @OwnerId";

            var affectedRows = await connection.ExecuteAsync(sql, image);

            if (affectedRows > 0) return await GetImageByIdAsync(image.Id);
            else return null;
        }

        public async Task<bool> DeleteImageAsync(int imageId, int ownerId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = "DELETE FROM images WHERE id = @Id AND owner_id = @OwnerId";
            var affectedRows = await connection.ExecuteAsync(sql, new { Id = imageId, OwnerId = ownerId });
            return affectedRows > 0;
        }

        public async Task<bool> DeleteAllImagesByUserAsync(int userId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = "DELETE FROM images WHERE owner_id = @UserId";
            var affectedRows = await connection.ExecuteAsync(sql, new { UserId = userId });
            return affectedRows > 0;
        }
    }
}