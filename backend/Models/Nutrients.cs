namespace backend.Models
{
    public class Nutrients
    {
        public int FoodId { get; set; }
        public decimal Protein { get; set; }
        public decimal Fat { get; set; }
        public decimal Carbohydrate { get; set; }

        public Nutrients() { }

        public Nutrients(int foodId, decimal protein, decimal fat, decimal carbohydrate)
        {
            FoodId = foodId;
            Protein = protein;
            Fat = fat;
            Carbohydrate = carbohydrate;
        }
    }
}
