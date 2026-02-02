using noava.Models;

namespace noava.Services.FAQs
{
    public interface IFaqService
    {
        Task<IEnumerable<FAQ>> GetAllFaqsAsync();
    }
}