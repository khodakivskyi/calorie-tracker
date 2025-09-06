namespace backend.Models
{
    public class DishFood
    {
        public int DishId { get; set; }
        public int FoodId { get; set; }
        public decimal Quantity { get; set; }

        public DishFood(int dishId, int foodId, decimal quantity)
        {
            DishId = dishId;
            FoodId = foodId;
            Quantity = quantity;
        }
    }
}