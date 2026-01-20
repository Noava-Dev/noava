using noava.Models;
using Noava.Repositories;


namespace noava.Services
{
    public class FaqService
    {
        private readonly FaqRepository _faqRepository;

        public FaqService(FaqRepository faqRepository)
        {
            _faqRepository = faqRepository;
        }

        public async Task<IEnumerable<FAQ>> GetAllFaqsAsync()
        {
            return await _faqRepository.GetAllAsync();
        }
    }
}