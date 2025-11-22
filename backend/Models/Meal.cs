using backend.GraphQL.Types;

namespace backend.Models
{
    public class Meal
    {
        public int Id { get; }
        public int OwnerId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int MealTypeId { get; set; }
        public DateTime CreatedAt { get; init; }
        public DateTime UpdatedAt { get; set; }

        public Meal() { }
        public Meal(int ownerId, int mealTypeId, string name)
        {
            OwnerId = ownerId;
            MealTypeId = mealTypeId;
            Name = name;
        }
    }
}
