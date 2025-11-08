namespace backend.Models
{
    public class Dish
    {
        public int Id { get; init; }
        public int? OwnerId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Weight { get; set; }
        public int? ImageId { get; set; }
        public DateTime CreatedAt { get; init; }
        public DateTime UpdatedAt { get; set; }
        public string? ExternalId { get; set; }

        public Image? Image { get; set; }

        public Dish() { }

        public Dish(int? ownerId, string name, decimal weight, int? imgId, string? externalId = null)
        {
            OwnerId = ownerId;
            Name = name;
            Weight = weight;
            ImageId = imgId;
            ExternalId = externalId;
        }
    }
}
