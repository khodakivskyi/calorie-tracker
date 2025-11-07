using Newtonsoft.Json;

namespace backend.Models.FatSecret
{
    public class FatSecretFoodDto
    {
        [JsonProperty("food_id")]
        public string Id { get; set; } = string.Empty;

        [JsonProperty("food_name")]
        public string Name { get; set; } = string.Empty;

        [JsonProperty("food_description")]
        public string Description { get; set; } = string.Empty;

        [JsonProperty("brand_name")]
        public string? BrandName { get; set; }
    }
}
