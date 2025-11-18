using MIIO.Data.Repository.Interfaces;

namespace MIIO.Data.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private ApplicationDbContext _db;
        public IOrderRepository Order { get; private set; }
        public IProductRepository Product { get; private set; }

        public UnitOfWork(ApplicationDbContext db)
        {
            _db = db;
            Order = new OrderRepository(db);
            Product = new ProductRepository(db);
        }

        public void Save()
        {
            _db.SaveChanges();
        }
    }
}
