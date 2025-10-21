namespace backend.Models
{
    public class Image
    {
        public int Id { get; }
        public int? OwnerId { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public DateTime CreatedAt { get; init; }
        public string? ExternalId { get; set; }

        public Image() { }

        public Image(int? ownerId, string fileName, string url, string? externalId = null)
        {
            OwnerId = ownerId;
            FileName = fileName;
            Url = url;
            ExternalId = externalId;
        }
    }
}
