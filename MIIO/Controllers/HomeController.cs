using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using MIIO.Data.Repository.Interfaces; 
using MIIO.Models;
using System.Linq; 

namespace MIIO.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IUnitOfWork _unitOfWork; 

        public HomeController(ILogger<HomeController> logger, IUnitOfWork unitOfWork)
        {
            _logger = logger;
            _unitOfWork = unitOfWork; 
        }

        public IActionResult Index()
        {
            var allProducts = _unitOfWork.Product.GetAll();

            var featuredProducts = allProducts.Where(p => p.Offer == true).ToList();

            ViewData["FeaturedProducts"] = featuredProducts;

            return View(allProducts);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}