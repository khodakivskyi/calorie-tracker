namespace backend.Models
{
    public class CreateMealInput
    {
        public int OwnerId { get; set; }
        public int TypeId { get; set; }
        public string Name { get; set; } = string.Empty;
        public List<CreateDishInput>? Dishes { get; set; }
    }
}

