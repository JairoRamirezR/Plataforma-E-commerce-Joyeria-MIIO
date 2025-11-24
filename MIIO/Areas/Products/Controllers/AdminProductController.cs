using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MIIO.Data.Repository.Interfaces;
using MIIO.Models;

namespace MIIO.Areas.Products.Controllers
{
    [Area("Products")]
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
            string wwwRootPath = _webHostEnvironment.WebRootPath;

            if (file != null)
            {
                string fileName = Guid.NewGuid().ToString();
                string extension = Path.GetExtension(file.FileName);
                var uploads = Path.Combine(wwwRootPath, @"images/products");

                using (var fileStream = new FileStream(Path.Combine(uploads
                    , fileName + extension), FileMode.Create))
                {
                    file.CopyTo(fileStream);
                }

                product.Image = @"/images/products/" + fileName + extension;
            }
            else
            {
                product.Image = @"/images/products/" + Utilities.StaticValues.Image_Unavailable;
            }

            _unitOfWork.Product.Add(product);
            _unitOfWork.Save();
            TempData["success"] = "Producto Guardado Correctamente";
            return RedirectToAction("Index");
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
        public IActionResult Edit(Product product, IFormFile? ImageFile)
        {
            if (!ModelState.IsValid)
                return View(product);

            var dbProduct = _unitOfWork.Product.Get(x => x.Id == product.Id);

            if (dbProduct == null)
                return NotFound();

            // 🟢 ACTUALIZAR CAMPOS
            dbProduct.Name = product.Name;
            dbProduct.Price = product.Price;
            dbProduct.Category = product.Category;
            dbProduct.Material = product.Material;
            dbProduct.Offer = product.Offer;
            dbProduct.Description = product.Description; // El texto con formato HTML se guarda aquí

            // 🟢 SI HAY IMAGEN SUBIDA
            if (ImageFile != null)
            {
                string wwwRootPath = _webHostEnvironment.WebRootPath;
                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(ImageFile.FileName);
                string uploads = Path.Combine(wwwRootPath, @"images/products");

                // eliminar la imagen anterior si no es la default
                if (!string.IsNullOrEmpty(dbProduct.Image))
                {
                    var oldImagePath = Path.Combine(wwwRootPath, dbProduct.Image.TrimStart('/'));

                    if (System.IO.File.Exists(oldImagePath))
                        System.IO.File.Delete(oldImagePath);
                }

                // guardar la nueva
                using (var stream = new FileStream(Path.Combine(uploads, fileName), FileMode.Create))
                {
                    ImageFile.CopyTo(stream);
                }

                dbProduct.Image = "/images/products/" + fileName;
            }

            // 🟢 ESTO ES SUFICIENTE. NO SE USA Update()
            _unitOfWork.Save();

            return RedirectToAction("Index");
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

            // Lógica para eliminar la imagen física si existe
            if (!string.IsNullOrEmpty(productToDelete.Image))
            {
                string wwwRootPath = _webHostEnvironment.WebRootPath;
                var imagePath = Path.Combine(wwwRootPath, productToDelete.Image.TrimStart('/'));
                if (System.IO.File.Exists(imagePath))
                {
                    System.IO.File.Delete(imagePath);
                }
            }

            _unitOfWork.Product.Remove(productToDelete);
            _unitOfWork.Save();
            return Json(new { success = true, message = "Producto Eliminado Correctamente" });
        }
        #endregion
    }
}