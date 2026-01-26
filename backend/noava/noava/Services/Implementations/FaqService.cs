using noava.Models;
using noava.Repositories.Contracts;
using noava.Services.Contracts;

namespace noava.Services.Implementations
{
    public class FaqService : IFaqService
    {
        private readonly IFaqRepository _faqRepository;

        public FaqService(IFaqRepository faqRepository)
        {
            _faqRepository = faqRepository;
        }

        public async Task<IEnumerable<FAQ>> GetAllFaqsAsync()
        {
            return await _faqRepository.GetAllAsync();
        }
    }
}