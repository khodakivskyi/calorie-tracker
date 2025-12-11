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

        public async Task<CalorieLimit?> GetLimitByOwnerIdAsync(int ownerId)
        {
            return await _repository.GetLimitByOwnerIdAsync(ownerId);
        }

        public async Task<CalorieLimit?> SetLimitAsync(int ownerId, decimal limitValue)
        {
            var existing = await _repository.GetLimitByOwnerIdAsync(ownerId);

            if (existing == null)
            {
                var newLimit = new CalorieLimit(ownerId, limitValue);
                return await _repository.CreateLimitAsync(newLimit);
            }

            existing.LimitValue = limitValue;
            return await _repository.UpdateLimitAsync(existing);
        }

        public async Task<bool> DeleteLimitAsync(int ownerId)
        {
            return await _repository.DeleteLimitAsync(ownerId);
        }
    }
}
