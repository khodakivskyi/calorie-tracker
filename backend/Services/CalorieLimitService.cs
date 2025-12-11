using backend.Models;
using backend.Repositories.Interfaces;
using backend.Services.Interfaces;

namespace backend.Services
{
    public class CalorieLimitService
    {
        private readonly ICalorieLimitRepository _repository;

        public CalorieLimitService(ICalorieLimitRepository repository)
        {
            _repository = repository;
        }

        public async Task<CalorieLimit?> GetLimitByUserIdAsync(int userId)
        {
            return await _repository.GetLimitByUserIdAsync(userId);
        }

        public async Task<CalorieLimit?> SetLimitAsync(int userId, decimal limitValue)
        {
            var existing = await _repository.GetLimitByUserIdAsync(userId);

            if (existing == null)
            {
                var newLimit = new CalorieLimit(userId, limitValue);
                return await _repository.CreateLimitAsync(newLimit);
            }

            existing.LimitValue = limitValue;
            return await _repository.UpdateLimitAsync(existing);
        }

        public async Task<bool> DeleteLimitAsync(int userId)
        {
            return await _repository.DeleteLimitAsync(userId);
        }
    }
}
