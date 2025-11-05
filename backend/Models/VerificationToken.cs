namespace backend.Models
{
    public class VerificationToken
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Token { get; set; } = string.Empty;
        public string TokenType { get; set; } = string.Empty; // "email_verification", "password_reset"
        public DateTime ExpiresAt { get; set; }
        public DateTime? UsedAt { get; set; }
        public DateTime CreatedAt { get; set; }

        public VerificationToken() { }

        public VerificationToken(int userId, string token, string tokenType, DateTime expiresAt)
        {
            UserId = userId;
            Token = token;
            TokenType = tokenType;
            ExpiresAt = expiresAt;
            CreatedAt = DateTime.UtcNow;
        }

        public bool IsValid() => 
            UsedAt == null && ExpiresAt > DateTime.UtcNow;
        
        public string GetFullToken() => $"{UserId}.{Token}";
    }
}

