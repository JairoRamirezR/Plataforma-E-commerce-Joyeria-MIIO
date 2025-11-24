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

        // Método para obtener todos los pedidos (usado por DataTables)
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

        // Método para actualizar el estado del pedido (Solo Admin)
        [HttpPost]
        [Authorize(Roles = Utilities.StaticValues.Role_Admin)]
        public IActionResult UpdateStatus([FromBody] UpdateStatusModel model)
        {
            // 1. Input Validation
            if (model.Id <= 0 || string.IsNullOrEmpty(model.NewStatus))
            {
                // Respuesta estandarizada para error de validación
                return BadRequest(new { success = false, message = "Error: Datos de pedido incompletos o inválidos." });
            }

            // 2. Find order in DB
            var orderFromDb = _unitOfWork.Order.Get(x => x.Id == model.Id);

            if (orderFromDb == null)
            {
                // Respuesta estandarizada si no se encuentra
                return NotFound(new { success = false, message = $"Error: Pedido con ID {model.Id} no encontrado." });
            }

            // 3. Update Logic
            try
            {
                // 3.1. Assign the new state
                orderFromDb.State = model.NewStatus;

                // 3.2. Save changes to the DB
                _unitOfWork.Order.Update(orderFromDb);
                _unitOfWork.Save();

                // 4. Success Response (Estandarizado)
                return Ok(new { success = true, message = "Estado del Pedido actualizado correctamente." });
            }
            catch (Exception)
            {
                // 5. Error Handling (Estandarizado)
                return StatusCode(500, new { success = false, message = "Error interno del servidor al actualizar el estado." });
            }
        }

        // Internal model to receive data from the AJAX request
        public class UpdateStatusModel
        {
            public int Id { get; set; }
            public string NewStatus { get; set; } // Nombre en inglés
        }

        #endregion
    }
}