using Microsoft.EntityFrameworkCore;

namespace FluxÆther.Data
{
    public class MasterDbContext : DbContext
    {
        public MasterDbContext(DbContextOptions<MasterDbContext> options) : base(options) { }

        public DbSet<UserDatabase> UserDatabases { get; set; }
    }

    public class UserDatabase
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string DatabaseName { get; set; }
        public string ConnectionString { get; set; }
    }
}
