namespace backend.Models
{
    public class MealDishDto
    {
        public int MealId { get; set; }
        public int DishId { get; set; }
        public decimal Quantity { get; set; }

        public MealDishDto() { }

        public MealDishDto(int mealId, int dishId, decimal quantity)
        {
            MealId = mealId;
            DishId = dishId;
            Quantity = quantity;
        }
    }
}
