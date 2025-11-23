using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using MIIO.Data.Repository.Interfaces; // Asegúrate de agregar este using
using MIIO.Models;

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
            // Obtener todos los productos de la base de datos
            // La función GetAll puede necesitar ajustes (ej: .ToList() o .AsEnumerable())
            // dependiendo de tu implementación de IUnitOfWork y el repositorio.
            var productList = _unitOfWork.Product.GetAll();

            // Pasar la lista de productos a la vista
            return View(productList);
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