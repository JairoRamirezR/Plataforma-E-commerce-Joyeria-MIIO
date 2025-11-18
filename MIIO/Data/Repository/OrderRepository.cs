using MIIO.Data.Repository.Interfaces;
using MIIO.Models;

namespace MIIO.Data.Repository
{
    public class OrderRepository : Repository<Order>, IOrderRepository
    {
        private ApplicationDbContext _db;
        public OrderRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }

        public void Update(Order order)
        {
            _db.orders.Update(order);
        }
    }
}
