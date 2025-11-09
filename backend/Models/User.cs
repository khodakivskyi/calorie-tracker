namespace backend.Models
{
    public class User
    {
        public int Id { get; private set; }
        public string? Name { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Salt { get; set; } = string.Empty;
        public bool EmailConfirmed { get; set; } = false;


        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpires { get; set; }

        public User() { }

        public User(string email, string passwordHash, string salt, string? name)
        {
            Email = email;
            PasswordHash = passwordHash;
            Salt = salt;
            Name = name;
        }
    }
}