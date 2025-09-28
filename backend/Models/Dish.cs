namespace backend.Models
{
    public class Dish
    {
        public int Id { get; set; }
        public int OwnerId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Weight { get; set; }
        public int? ImageId { get; set; }
        public DateTime CreatedAt { get; init; } = DateTime.UtcNow;

        public Dish() { }
        public Dish(int ownerId, string name, decimal weight) : this(ownerId, name, weight, null) { }
        public Dish(int ownerId, string name, decimal weight, int? imgId)
        {
            OwnerId = ownerId;
            Name = name;
            Weight = weight;
            ImageId = imgId;
        }
    }
}
