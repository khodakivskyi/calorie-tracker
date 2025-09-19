namespace backend.Models
{
    public class Nutrients
    {
        public int Id { get; }
        public decimal Protein { get; set; }
        public decimal Fat { get; set; }
        public decimal Carbohydrates { get; set; }
        public int FoodId { get; set; }

        public Nutrients(int foodId, decimal protein, decimal fat, decimal carbohydrates)
        {
            FoodId = foodId;
            Protein = protein;
            Fat = fat;
            Carbohydrates = carbohydrates;
        }
    }
}
