namespace backend.Models
{
    public class CaloriesModel
    {
        public int FoodId { get; set; }
        public decimal Calories { get; set; }
        public decimal Value { get; internal set; }

        public CaloriesModel() { }
        public CaloriesModel(int foodId, decimal calories)
        {
            FoodId = foodId;
            Calories = calories;
        }
        
        public static CaloriesModel ForDish(int dishId, decimal calories)
        {
            return new CaloriesModel { FoodId = dishId, Calories = calories };
        }
        
        public static CaloriesModel ForMeal(int mealId, decimal calories)
        {
            return new CaloriesModel { FoodId = mealId, Calories = calories };
        }
    }
}
