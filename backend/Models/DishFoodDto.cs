namespace backend.Models
{
    public class DishFoodDto
    {
        public int DishId { get; set; }
        public int FoodId { get; set; }
        public decimal Quantity { get; set; }

        public DishFoodDto() { }

        public DishFoodDto(int dishId, int foodId, decimal quantity)
        {
            DishId = dishId;
            FoodId = foodId;
            Quantity = quantity;
        }
    }
}
