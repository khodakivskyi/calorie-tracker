namespace backend.Models
{
    public class CaloriesModel
    {
        public int Id { get; }
        public decimal Calories { get; set; }
        public int FoodId { get; set; }

        public CaloriesModel() { }
        public CaloriesModel(int foodId, decimal calories)
        {
            FoodId = foodId;
            Calories = calories;
        }
    }
}
