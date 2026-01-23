using Microsoft.AspNetCore.Mvc;
using noava.Models;
using noava.Services.Contracts;

namespace noava.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FaqController : ControllerBase
    {
        private readonly IFaqService _faqService;

        public FaqController(IFaqService faqService)
        {
            _faqService = faqService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FAQ>>> GetFaqs()
        {
            var faqs = await _faqService.GetAllFaqsAsync();
            return Ok(faqs);
        }
    }
}