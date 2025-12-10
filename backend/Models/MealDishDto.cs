namespace backend.Models
{
    public class MealDishDto
    {
        public int MealId { get; set; }
        public int DishId { get; set; }
        public decimal Weight { get; set; }

        public MealDishDto() { }

        public MealDishDto(int mealId, int dishId, decimal weight)
        {
            MealId = mealId;
            DishId = dishId;
            Weight = weight;
        }
    }
}
