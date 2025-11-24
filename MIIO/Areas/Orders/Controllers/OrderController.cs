using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MIIO.Data.Repository.Interfaces;
using MIIO.Extensions;
using MIIO.Models;

namespace MIIO.Areas.Orders.Controllers
{
    [Area("Orders")]
    [Authorize]
    //[Authorize(Roles = Utilities.StaticValues.Role_Admin)]
    public class OrderController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<ApplicationUser> _userManager;

        public OrderController(IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }

        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public IActionResult Create()
        {
            var cart = HttpContext.Session.GetObject<List<Product>>("Cart");

            if (cart == null || !cart.Any())
                return Json(new { success = false, message = "Carrito vacio" });

            var userId = _userManager.GetUserId(User);

            if (userId == null)
                return Json(new { success = false, message = "Usuario no autenticado" });

            var order = new Order
            {
                UserId = userId,
                Description = string.Join(", ", cart.Select(x => x.Name)),
                TotalAmount = cart.Sum(x => x.Price),
                Date = DateTime.Now,
                State = "Pendiente"
            };

            _unitOfWork.Order.Add(order);
            _unitOfWork.Save();

            HttpContext.Session.Remove("Cart");

            TempData["success"] = "Pedido creado correctamente";

            return Json(new { success = true, orderId = order.Id });
        }
        public IActionResult Details(int? id)
        {
            if (id == null || id == 0)
            {
                return NotFound();
            }
            Order orderFromDb = _unitOfWork.Order.Get(x => x.Id == id);
            if (orderFromDb == null)
            {
                return NotFound();
            }
            return View(orderFromDb);
        }
        
        #region API
        public async Task<IActionResult> GetAll(DateTime? startDate, DateTime? endDate)
        {
            var orderList = await _unitOfWork.Order.GetAllAsync();
            if (startDate.HasValue)
                orderList = orderList.Where(o => o.Date >= startDate.Value).ToList();
            
            if (endDate.HasValue)
                orderList = orderList.Where(o => o.Date <= endDate.Value).ToList();

            var result = new List<object>();

            foreach (var order in orderList)
            {
                var user = await _userManager.FindByIdAsync(order.UserId);
                result.Add(new
                {
                    order.Id,
                    order.UserId,
                    order.Description,
                    order.TotalAmount,
                    order.Date,
                    order.State,
                    UserName = user?.UserName ?? "Desconocido"
                });
            }
            return Json(new { data = result });

        }
        #endregion
    }
}
