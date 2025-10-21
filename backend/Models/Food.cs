namespace backend.Models
{
    public class Food
    {
        public int Id { get; init; }
        public int? OwnerId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int? ImageId { get; set; }
        public DateTime CreatedAt { get; init; }
        public DateTime UpdatedAt { get; set; }
        public string? ExternalId { get; set; }

        public Image? Image { get; set; }

        public Food() { }

        public Food(int? ownerId, string name, int? imageId, string? externalId = null)
        {
            OwnerId = ownerId;
            Name = name;
            ImageId = imageId;
            ExternalId = externalId;
        }
    }
}
