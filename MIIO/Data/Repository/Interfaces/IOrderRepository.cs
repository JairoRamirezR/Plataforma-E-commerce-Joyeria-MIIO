using MIIO.Models;

namespace MIIO.Data.Repository.Interfaces
{
    public interface IOrderRepository : IRepository<Order>
    {
        void Update(Order order);
    }
}
