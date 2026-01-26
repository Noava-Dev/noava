using noava.Models;

namespace noava.Repositories.Contracts
{
    public interface IFaqRepository
    {
        Task<IEnumerable<FAQ>> GetAllAsync();
    }
}