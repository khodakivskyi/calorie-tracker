namespace backend.Models
{
    public class ImageSettings
    {
        public long MaxFileSizeBytes { get; set; }
        public string[] AllowedExtensions { get; set; } = [];
        public string ImagesFolder { get; set; } = string.Empty;
    }
}
