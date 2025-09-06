namespace backend.Models
{
    public class User
    {
        public int Id { get; }
        public string? Name { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Salt { get; set; } = string.Empty;

        public User(string email, string passwordHash, string salt) : this(email, passwordHash, salt, null)
        {
        }

        public User(string email, string passwordHash, string salt, string? name)
        {
            Email = email;
            PasswordHash = passwordHash;
            Salt = salt;
            Name = name;
        }
    }
}