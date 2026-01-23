using noava.Models;

namespace noava.Services.Contracts
{
    public interface IFaqService
    {
        Task<IEnumerable<FAQ>> GetAllFaqsAsync();
    }
}