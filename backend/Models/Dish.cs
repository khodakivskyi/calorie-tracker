namespace backend.Models
{
    public class Dish
    {
        public int Id { get; init; }
        public int? OwnerId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal? Calories { get; set; }//Todo: make non-nullable
        public decimal? Proteins { get; set; }
        public decimal? Carbs { get; set; }
        public decimal? Fats { get; set; }
        public decimal Weight { get; set; }
        public int? ImageId { get; set; }
        public DateTime CreatedAt { get; init; }
        public DateTime UpdatedAt { get; set; }
        public bool IsExternal { get; set; }

        public Image? Image { get; set; }

        public Dish() { }

        public Dish(int? ownerId, string name, decimal weight, int? imgId, bool? isExternal = null)
        {
            OwnerId = ownerId;
            Name = name;
            Weight = weight;
            ImageId = imgId;
            IsExternal = isExternal ?? false;
        }
    }
}
