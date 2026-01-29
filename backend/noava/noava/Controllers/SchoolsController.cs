using Microsoft.AspNetCore.Mvc;

namespace noava.Controllers
{
    public class SchoolsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
