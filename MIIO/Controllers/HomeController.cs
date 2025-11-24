using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using MIIO.Data.Repository.Interfaces; // Asegúrate de agregar este using
using MIIO.Models;
using System.Linq; // Necesario para usar .Where() y .ToList()

namespace MIIO.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IUnitOfWork _unitOfWork; // Declarar la interfaz para acceso a datos

        // Constructor modificado para inyectar IUnitOfWork
        public HomeController(ILogger<HomeController> logger, IUnitOfWork unitOfWork)
        {
            _logger = logger;
            _unitOfWork = unitOfWork; // Asignar la inyección
        }

        public IActionResult Index()
        {
            // Obtener TODOS los productos (para la sección "Todos los productos")
            var allProducts = _unitOfWork.Product.GetAll();

            // Obtener los productos con oferta (para la sección "Destacados")
            // Filtramos los productos donde la propiedad Offer es verdadera.
            var featuredProducts = allProducts.Where(p => p.Offer == true).ToList();

            // Pasar los productos destacados a la vista usando ViewData
            ViewData["FeaturedProducts"] = featuredProducts;

            // Pasar TODOS los productos como el modelo principal de la vista
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