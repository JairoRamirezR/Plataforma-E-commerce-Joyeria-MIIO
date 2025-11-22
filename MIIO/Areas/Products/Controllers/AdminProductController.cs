using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MIIO.Data.Repository.Interfaces;
using MIIO.Models;

namespace MIIO.Areas.Products.Controllers
{
    //[Area("Products")]
    //[Authorize(Roles = Utilities.StaticValues.Role_Admin)]
    public class AdminProductController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private IWebHostEnvironment _webHostEnvironment;

        public AdminProductController(IUnitOfWork unitOfWork, IWebHostEnvironment webHostEnvironment)
        {
            _unitOfWork = unitOfWork;
            _webHostEnvironment = webHostEnvironment;
        }

        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Create() 
        {
            return View();
        }
        [HttpPost]
        public IActionResult Create(Product product, IFormFile? file) 
        {
            if (ModelState.IsValid)
            {
                if (file != null)
                {
                    string wwwRootPath = _webHostEnvironment.WebRootPath;
                    string fileName = Guid.NewGuid().ToString();
                    string extension = Path.GetExtension(file.FileName);
                    var uploads = Path.Combine(wwwRootPath, @"images/products");
                    if (product.Image != null)
                    {
                        var oldImageURL = Path.Combine(wwwRootPath, product.Image);
                        if (oldImageURL != Path.Combine(uploads, Utilities.StaticValues.Image_Unavailable))
                        {
                            if (System.IO.File.Exists(oldImageURL))
                            {
                                System.IO.File.Delete(oldImageURL);
                            }
                        }
                        using (var fileStream = new FileStream(Path.Combine(uploads
                            , fileName + extension), FileMode.Create))
                        {
                            file.CopyTo(fileStream);
                        }
                        product.Image = @"/images/products/" + fileName + extension;
                    }
                    else { 
                        product.Image = @"/images/products/" + Utilities.StaticValues.Image_Unavailable;
                    }
                }
                _unitOfWork.Product.Add(product);
                _unitOfWork.Save();
                TempData["success"] = "Producto Guardado Correctamente";
                return RedirectToAction("Index");
            }
            return View();
        }
        public IActionResult Edit(int? id) 
        {
            if (id == null || id == 0)
            {
                return NotFound();
            }
            Product produtFromDB = _unitOfWork.Product.Get(x => x.Id == id);
            if (produtFromDB == null)
            {
                return NotFound();
            }
            return View(produtFromDB);
        }

        [HttpPost]
        public IActionResult Edit(Product product, IFormFile file) 
        {
            if (ModelState.IsValid)
            {
                if (file != null)
                {
                    string wwwRootPath = _webHostEnvironment.WebRootPath;
                    string fileName = Guid.NewGuid().ToString();
                    string extension = Path.GetExtension(file.FileName);
                    var uploads = Path.Combine(wwwRootPath, @"images/products");
                    if (product.Image != null)
                    {
                        var oldImageURL = Path.Combine(wwwRootPath, product.Image);
                        if (oldImageURL != Path.Combine(uploads, Utilities.StaticValues.Image_Unavailable))
                        {
                            if (System.IO.File.Exists(oldImageURL))
                            {
                                System.IO.File.Delete(oldImageURL);
                            }
                        }
                        using (var fileStream = new FileStream(Path.Combine(uploads
                            , fileName + extension), FileMode.Create))
                        {
                            file.CopyTo(fileStream);
                        }
                        product.Image = @"/images/products/" + fileName + extension;
                    }
                }
                _unitOfWork.Product.Update(product);
                _unitOfWork.Save();
                TempData["success"] = "Producto Editado Correctamente";
                return RedirectToAction("Index");
            }
            return View();
        }
        #region API
        public IActionResult GetAll()
        {
            var productList = _unitOfWork.Product.GetAll();
            return Json(new { data = productList });
        }
        [HttpDelete]
        public IActionResult Delete(int? id) 
        {
            var productToDelete = _unitOfWork.Product.Get(x => x.Id == id);
            if (productToDelete == null)
            {
                return Json(new { success = false, message = "Error al Eliminar" });
            }
            _unitOfWork.Product.Remove(productToDelete);
            _unitOfWork.Save();
            return Json(new { success = true, message = "Plato Eliminado Correctamente" });
        }
        #endregion
    }
}
