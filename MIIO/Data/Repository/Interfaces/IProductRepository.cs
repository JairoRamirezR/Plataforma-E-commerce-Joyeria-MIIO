using MIIO.Models;

namespace MIIO.Data.Repository.Interfaces
{
    public interface IProductRepository : IRepository<Product>
    {
        void Update(Product product);
    }
}
