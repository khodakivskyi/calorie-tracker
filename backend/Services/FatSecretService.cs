using backend.Models;
using backend.Models.FatSecret;
using Newtonsoft.Json;
using System.Net.Http.Headers;

namespace backend.Services.External
{
    public class FatSecretService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;
        private readonly NutrientsService _nutrientsService;
        private readonly CaloriesService _caloriesService;
        private readonly FoodService _foodService;

        private string? _cachedToken;
        private DateTime _tokenExpiry = DateTime.MinValue;

        public FatSecretService(
            HttpClient httpClient,
            IConfiguration config,
            NutrientsService nutrientsService,
            CaloriesService caloriesService,
            FoodService foodService)
        {
            _httpClient = httpClient;
            _config = config;
            _nutrientsService = nutrientsService;
            _caloriesService = caloriesService;
            _foodService = foodService;
        }

        private async Task<string> GetAccessTokenAsync()
        {
            if (_cachedToken != null && DateTime.UtcNow < _tokenExpiry)
                return _cachedToken;

            var clientId = _config["FatSecret:ClientId"];
            var clientSecret = _config["FatSecret:ClientSecret"];
            var authHeader = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}"));

            var request = new HttpRequestMessage(HttpMethod.Post, "https://oauth.fatsecret.com/connect/token");
            request.Headers.Authorization = new AuthenticationHeaderValue("Basic", authHeader);
            request.Content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["grant_type"] = "client_credentials",
                ["scope"] = "basic"
            });

            var response = await _httpClient.SendAsync(request);
            var json = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw new Exception($"Failed to get token: {response.StatusCode} - {json}");

            var tokenData = JsonConvert.DeserializeObject<FatSecretTokenResponse>(json)!;

            _cachedToken = tokenData.AccessToken;
            _tokenExpiry = DateTime.UtcNow.AddSeconds(tokenData.ExpiresIn - 60);

            return _cachedToken;
        }

        public async Task<IEnumerable<Food>> SearchFoodsAsync(string query, int? ownerId = null)
        {
            var token = await GetAccessTokenAsync();
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var url = $"https://platform.fatsecret.com/rest/server.api?method=foods.search&search_expression={Uri.EscapeDataString(query)}&format=json";
            var response = await _httpClient.GetAsync(url);
            var json = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw new Exception($"FatSecret API error: {response.StatusCode}, {json}");

            var result = JsonConvert.DeserializeObject<FatSecretSearchResponse>(json);
            var dtoList = result?.Foods?.FoodList ?? new List<FatSecretFoodDto>();

            var foods = new List<Food>();

            foreach (var r in dtoList)
            {
                var name = r.Name;
                if (!string.IsNullOrWhiteSpace(r.BrandName))
                    name = $"{name} ({r.BrandName})";

                var details = await GetFoodDetailsAsync(r.Id);

                decimal? calories = null;
                decimal? protein = null;
                decimal? fat = null;
                decimal? carbs = null;

                if (details != null)
                {
                    calories = (decimal)details.Value.Calories;
                    protein = (decimal)details.Value.Protein;
                    fat = (decimal)details.Value.Fat;
                    carbs = (decimal)details.Value.Carbs;
                }

                var createdFood = await _foodService.CreateFoodAsync(
                    userId: ownerId,
                    name: name,
                    imageId: null,
                    externalId: r.Id,
                    calories: calories,
                    protein: protein,
                    fat: fat,
                    carbohydrates: carbs
                );

                foods.Add(createdFood);
            }

            return foods;
        }

        public async Task<(double Calories, double Protein, double Fat, double Carbs)?> GetFoodDetailsAsync(string foodId)
        {
            var token = await GetAccessTokenAsync();
            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token);

            var url = $"https://platform.fatsecret.com/rest/server.api?method=food.get.v3&food_id={foodId}&format=json";
            var response = await _httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"❌ FatSecret API error: {response.StatusCode}");
                return null;
            }

            var json = await response.Content.ReadAsStringAsync();
            var data = JsonConvert.DeserializeObject<FoodResponse>(json);

            var serving = data?.Food?.Servings?.Serving?.FirstOrDefault();
            if (serving == null)
                return null;

            double.TryParse(serving.Calories, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out double calories);
            double.TryParse(serving.Protein, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out double protein);
            double.TryParse(serving.Fat, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out double fat);
            double.TryParse(serving.Carbs, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out double carbs);
            double.TryParse(serving.MetricServingAmount, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out double grams);

            if (grams <= 0)
                grams = 100;

            double factor = 100.0 / grams;

            return (
                Calories: Math.Round(calories * factor, 2),
                Protein: Math.Round(protein * factor, 2),
                Fat: Math.Round(fat * factor, 2),
                Carbs: Math.Round(carbs * factor, 2)
            );
        }
    }
}
