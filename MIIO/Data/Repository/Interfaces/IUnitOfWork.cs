namespace MIIO.Data.Repository.Interfaces
{
    public interface IUnitOfWork
    {
        IOrderRepository Order { get; }
        IProductRepository Product { get; }
        void Save();
    }
}
