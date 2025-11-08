namespace backend.Models
{
    public class VerificationToken
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Token { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime ExpiresAt { get; set; }

        public VerificationToken() { }

        public VerificationToken(int userId, string token, DateTime expiresAt)
        {
            UserId = userId;
            Token = token;
            ExpiresAt = expiresAt;
            CreatedAt = DateTime.UtcNow;
        }

        public bool IsExpired() => DateTime.UtcNow >= ExpiresAt;

        public string GetFullToken() => $"{UserId}.{Token}";
    }
}

