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

        public async Task<Image?> GetImageByIdAsync(int id)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                SELECT id, owner_id AS OwnerId, file_name AS FileName, 
                       url, created_at AS CreatedAt
                FROM images 
                WHERE id = @Id";

            return await connection.QuerySingleOrDefaultAsync<Image>(sql, new { Id = id });
        }

        public async Task<IEnumerable<Image>> GetImagesByOwnerAsync(int ownerId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                SELECT id, owner_id AS OwnerId, file_name AS FileName, 
                       url, created_at AS CreatedAt
                FROM images 
                WHERE owner_id = @OwnerId
                ORDER BY created_at DESC";

            return await connection.QueryAsync<Image>(sql, new { OwnerId = ownerId });
        }

        public async Task<Image> CreateImageAsync(Image image)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                INSERT INTO images (owner_id, file_name, url)
                OUTPUT INSERTED.id, INSERTED.owner_id AS OwnerId, 
                       INSERTED.file_name AS FileName, INSERTED.url,
                       INSERTED.created_at AS CreatedAt
                VALUES (@OwnerId, @FileName, @Url)";

            return await connection.QuerySingleAsync<Image>(sql, image);
        }

        //апдейт з видаленням старого?

        public async Task<bool> DeleteImageAsync(int id, int ownerId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = "DELETE FROM images WHERE id = @Id AND owner_id = @OwnerId";
            var affectedRows = await connection.ExecuteAsync(sql, new { Id = id, OwnerId = ownerId });
            return affectedRows > 0;
        }

        public async Task<bool> DeleteAllImagesByOwnerAsync(int ownerId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = "DELETE FROM images WHERE owner_id = @OwnerId";
            var affectedRows = await connection.ExecuteAsync(sql, new { OwnerId = ownerId });
            return affectedRows > 0;
        }
    }
}