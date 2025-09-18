namespace backend.Models
{
    public class Food
    {
        public int Id { get; }
        public int OwnerId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int? ImageId { get; set; }
        public DateTime CreatedAt { get; init; }
        public int Source { get; set; }
        public string? ExternalId { get; set; }

        public Food(int ownerId, string name, int? imageId, int source, string? externalId = null)
        {
            OwnerId = ownerId;
            Name = name;
            ImageId = imageId;
            Source = source;
            ExternalId = externalId;
        }
    }
}
