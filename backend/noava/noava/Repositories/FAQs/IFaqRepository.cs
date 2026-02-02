using noava.Models;

namespace noava.Repositories.FAQs
{
    public interface IFaqRepository
    {
        Task<IEnumerable<FAQ>> GetAllAsync();
    }
}