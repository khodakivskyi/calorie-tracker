namespace backend.Models
{
    public class CalorieLimit
    {
        public int Id { get; }
        public int UserId { get; init; }
        public decimal LimitValue { get; set; }
        public DateTime CreatedAt { get; init; }

        public CalorieLimit() { }

        public CalorieLimit(int userId, decimal limitValue)
        {
            UserId = userId;
            LimitValue = limitValue;
        }
    }
}
