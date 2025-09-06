namespace backend.Models
{
    public class Meal
    {
        public int Id { get; }
        public int OwnerId { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime CreatedAt { get; init; } //чи може реалізувати можливість зміни?

        public Meal(int ownerId, string name)
        {
            OwnerId = ownerId;
            Name = name;
        }
    }
}
