using Newtonsoft.Json;

namespace backend.Models.FatSecret
{
    public class FoodResponse
    {
        [JsonProperty("food")]
        public FoodData? Food { get; set; }
    }

    public class FoodData
    {
        [JsonProperty("food_id")]
        public string? FoodId { get; set; }

        [JsonProperty("food_name")]
        public string? Name { get; set; }

        [JsonProperty("servings")]
        public ServingsData? Servings { get; set; }
    }

    public class ServingsData
    {
        // іноді це може бути або список, або один об’єкт
        [JsonProperty("serving")]
        [JsonConverter(typeof(SingleOrArrayConverter<ServingData>))]
        public List<ServingData>? Serving { get; set; }
    }

    public class ServingData
    {
        [JsonProperty("calories")]
        public string? Calories { get; set; }

        [JsonProperty("protein")]
        public string? Protein { get; set; }

        [JsonProperty("fat")]
        public string? Fat { get; set; }

        [JsonProperty("carbohydrate")]
        public string? Carbs { get; set; }

        [JsonProperty("metric_serving_amount")]
        public string? MetricServingAmount { get; set; }

        [JsonProperty("metric_serving_unit")]
        public string? MetricServingUnit { get; set; }
    }

    /// <summary>
    /// Допоміжний конвертер, який дозволяє десеріалізувати об'єкти або масиви.
    /// FatSecret API може повертати або {"serving": {...}} або {"serving": [{...}, {...}]}.
    /// </summary>
    public class SingleOrArrayConverter<T> : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return (objectType == typeof(List<T>));
        }

        public override object ReadJson(JsonReader reader, Type objectType, object? existingValue, JsonSerializer serializer)
        {
            if (reader.TokenType == JsonToken.StartArray)
            {
                return serializer.Deserialize<List<T>>(reader)!;
            }

            var instance = serializer.Deserialize<T>(reader);
            return new List<T> { instance! };
        }

        public override void WriteJson(JsonWriter writer, object? value, JsonSerializer serializer)
        {
            serializer.Serialize(writer, value);
        }
    }

}
