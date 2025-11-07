using Newtonsoft.Json;

namespace backend.Models.FatSecret
{
    public class FatSecretFoods
    {
        [JsonProperty("food")]
        public List<FatSecretFoodDto> FoodList { get; set; } = new();
    }

}
