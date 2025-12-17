namespace backend.Models
{
    public class DishFoodDto
    {
        public int DishId { get; set; }
        public int FoodId { get; set; }
        public decimal Weight { get; set; }

        public DishFoodDto() { }

        public DishFoodDto(int dishId, int foodId, decimal weight)
        {
            DishId = dishId;
            FoodId = foodId;
            Weight = weight;
        }
    }
}
