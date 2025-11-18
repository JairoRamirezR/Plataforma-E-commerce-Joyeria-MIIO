using MIIO.Data.Repository.Interfaces;
using MIIO.Models;

namespace MIIO.Data.Repository
{
    public class ProductRepository : Repository<Product>, IProductRepository
    {
        private ApplicationDbContext _db;
        public ProductRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }

        public void Update(Product product)
        {
            _db.products.Update(product);
        }
    }
}
