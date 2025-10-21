namespace backend.Models
{
    public class CaloriesModel
    {
        public int FoodId { get; set; }
        public decimal Calories { get; set; }

        public CaloriesModel() { }

        public CaloriesModel() { }
        public CaloriesModel(int foodId, decimal calories)
        {
            FoodId = foodId;
            Calories = calories;
        }
    }
}
