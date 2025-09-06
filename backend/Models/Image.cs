namespace backend.Models
{
    public class Image
    {
        public int Id { get; }
        public int OwnerId { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public int FileSize { get; set; }
        public string MimeType { get; set; } = string.Empty;
        public DateTime CreatedAt { get; init; }

        public Image(int ownerId, string fileName, string filePath, int fileSize, string mimeType)
        {
            OwnerId = ownerId;
            FileName = fileName;
            FilePath = filePath;
            FileSize = fileSize;
            MimeType = mimeType;
        }
    }
}
