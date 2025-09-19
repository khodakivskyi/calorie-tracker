namespace backend.Models
{
    public class Image
    {
        public int Id { get; }
        public int OwnerId { get; set; }
        public string FileName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; init; }
        public string CloudinaryUrl { get; set; } = string.Empty;
        public string CloudinaryPublicId { get; set; } = string.Empty;

        public Image(int ownerId, string fileName, string cloudinaryUrl, string cloudinaryPublicId)
        {
            OwnerId = ownerId;
            FileName = fileName;
            CloudinaryUrl = cloudinaryUrl;
            CloudinaryPublicId = cloudinaryPublicId;
        }
    }
}
