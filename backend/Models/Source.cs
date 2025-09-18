namespace backend.Models
{
    public class Source
    {
        public int Id { get; }
        public string Name { get; set; } = string.Empty;

        public Source(string name)
        {
            Name = name;
        }
    }
}
