using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MIIO.Data.Repository.Interfaces;
using MIIO.Models;
using NuGet.Packaging.Rules;

namespace MIIO.Areas.Products.Controllers
{
    [Area("Products")]
    //[Authorize(Roles = Utilities.StaticValues.Role_Client)]
    public class ProductController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;

        public ProductController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Details(int? id) 
        {
            if (id == null || id == 0)
            {
                return NotFound();
            }
            Product productFromDb = _unitOfWork.Product.Get(x => x.Id == id);
            if (productFromDb == null)
            {
                return NotFound();
            }
            return View(productFromDb);
        }
        #region API
        public IActionResult GetAll() { 
            var productList = _unitOfWork.Product.GetAll();
            return Json(new { data = productList });
        }
        #endregion
    }
}
