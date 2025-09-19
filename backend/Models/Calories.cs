namespace backend.Models
{
    public class Calories
    {
        public int Id { get; }
        public decimal Calories { get; set; }
        public int FoodId { get; set; }

        public Calories(int foodId, decimal calories)
        {
            FoodId = foodId;
            Calories = calories;
        }
    }
}
