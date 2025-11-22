using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IMealTypeRepository
    {
        Task<MealType?> GetMealTypeByIdAsync(int mealTypeId);
    }
}
