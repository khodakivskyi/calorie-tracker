using Newtonsoft.Json;

namespace backend.Models.FatSecret
{
    public class FatSecretSearchResponse
    {
        [JsonProperty("foods")]
        public FatSecretFoods? Foods { get; set; }
    }
}
