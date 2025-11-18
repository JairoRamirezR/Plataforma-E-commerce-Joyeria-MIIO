using System.Linq.Expressions;

namespace MIIO.Data.Repository.Interfaces
{
    public interface IRepository <T> where T : class
    {
        void Add(T entity);
        Task <T> GetAsync(Expression<Func<T, bool>> filter, string? includeProperties = null);
        T Get(Expression<Func<T, bool>> filter, string? includeProperties = null);
        IEnumerable<T> GetAll(string? includeProperties = null);
        Task<IEnumerable<T>> GetAllAsync(string? includeProperties = null);
        void Remove(T entity);
        void RemoveRange(IEnumerable<T> entities);
    }
}
