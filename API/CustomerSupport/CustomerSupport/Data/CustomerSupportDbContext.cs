using CustomerSupport.Models;
using Microsoft.EntityFrameworkCore;

namespace CustomerSupport.Data
{
    public class CustomerSupportDbContext : DbContext
    {
        public CustomerSupportDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
    }
}
