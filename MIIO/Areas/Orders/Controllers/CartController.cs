using Microsoft.AspNetCore.Mvc;
using MIIO.Data.Repository.Interfaces;
using MIIO.Extensions;
using MIIO.Models;

namespace MIIO.Areas.Orders.Controllers
{
    [Area("Orders")]
    public class CartController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;

        public CartController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public IActionResult Index()
        {
            var cart = HttpContext.Session.GetObject<List<Product>>("Cart") ?? new List<Product>();
            return View(cart);
        }

        [HttpPost]
        public IActionResult Add(int id) { 
            var product = _unitOfWork.Product.Get(p => p.Id ==  id);
            if (product == null)
            {
                return Json(new { success = false });
            }
            if (product.Offer == true)
            {
                product.Price = Convert.ToInt32(product.Price * 0.9);
            }
            List<Product> cart = HttpContext.Session.GetObject<List<Product>>("Cart") ?? new List<Product>();
            cart.Add(product);
            HttpContext.Session.SetObject("Cart", cart);
            return Json(new { success = true });
        }
        [HttpPost]
        public IActionResult Remove(int id)
        {
            var cart = GetCart();

            var item = cart.FirstOrDefault(p => p.Id == id);

            if (item == null)
            {
                return Json(new { success = false, message = "El producto no está en el carrito" });
            }

            cart.Remove(item);
            SaveCart(cart);

            return Json(new { success = true, message = "Producto eliminado" });
        }
        private List<Product> GetCart()
        {
            var cart = HttpContext.Session.GetObject<List<Product>>("Cart");

            if (cart == null)
            {
                cart = new List<Product>();
                HttpContext.Session.SetObject("Cart", cart);
            }

            return cart;
        }

        private void SaveCart(List<Product> cart)
        {
            HttpContext.Session.SetObject("Cart", cart);
        }
    }
}
