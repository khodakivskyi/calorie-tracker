namespace backend.Models
{
    public class CreateDishInput
    {
        public int OwnerId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Weight { get; set; }
        public int? ImageId { get; set; }
        public List<CreateDishFoodInput>? Foods { get; set; }
    }
}

