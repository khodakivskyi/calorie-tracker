namespace backend.Models
{
    public class CalorieLimit
    {
        public int Id { get; }
        public int OwnerId { get; init; }
        public decimal LimitValue { get; set; }
        public DateTime CreatedAt { get; init; }

        public CalorieLimit() { }

        public CalorieLimit(int ownerId, decimal limitValue)
        {
            OwnerId = ownerId;
            LimitValue = limitValue;
        }
    }
}