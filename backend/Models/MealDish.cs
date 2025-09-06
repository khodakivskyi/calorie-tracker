namespace backend.Models
{
    public class MealDish
    {
        public int MealId { get; set; }
        public int DishId { get; set; }
        public decimal Quantity { get; set; }


        public MealDish(int mealId, int dishId, decimal quantity)
        {
            MealId = mealId;
            DishId = dishId;
            Quantity = quantity;
        }
    }
}