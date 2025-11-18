using Microsoft.AspNetCore.Mvc;

namespace MIIO.Areas.Orders.Controllers
{
    public class OrderController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
