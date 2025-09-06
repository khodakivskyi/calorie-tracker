namespace backend.Models
{
    public class Food
    {
        public int Id { get; }
        public int OwnerId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int? ImageId { get; set; }
        public DateTime CreatedAt { get; init; }

        //на 100г
        public decimal? Calories { get; set; }
        public decimal? Carbohydrates { get; set; }
        public decimal? Proteins { get; set; }
        public decimal? Fats { get; set; }

        public Food(int ownerId, string name, int? imageId, decimal? calories,
                   decimal? carbohydrates, decimal? proteins, decimal? fats)
        {
            OwnerId = ownerId;
            Name = name;
            ImageId = imageId;
            Calories = calories;
            Carbohydrates = carbohydrates;
            Proteins = proteins;
            Fats = fats;
        }
    }
}
