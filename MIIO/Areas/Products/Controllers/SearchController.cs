using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MIIO.Data.Repository.Interfaces;

namespace MIIO.Areas.Products.Controllers
{
    [Area("Products")]
    public class SearchController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;

        public SearchController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public IActionResult Results(string query) {

            var results = _unitOfWork.Product.GetAll(
                p => p.Name.Contains(query) || p.Category.Contains(query)
             );
            return View(results);
        }
    }
}
