namespace backend.Models
{
    public class Food
    {
        public int Id { get; init; }
        public int? OwnerId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal? Calories { get; set; }//Todo: make non-nullable
        public decimal? Protein { get; set; }
        public decimal? Carbohydrate { get; set; }
        public decimal? Fat { get; set; }
        public int? ImageId { get; set; }
        public DateTime CreatedAt { get; init; }
        public DateTime UpdatedAt { get; set; }
        public bool IsExternal { get; set; } = false;

        public Image? Image { get; set; }

        public Food() { }

        public Food(int? ownerId, string name, int? imageId, bool? isExternal = null)
        {
            OwnerId = ownerId;
            Name = name;
            ImageId = imageId;
            IsExternal = isExternal ?? false;
        }
    }
}