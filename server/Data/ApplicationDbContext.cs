using Microsoft.EntityFrameworkCore;
using FluxÆther.Models;

namespace FluxÆther.Data
{
    public class ApplicationDbContext : DbContext
    {
        private readonly string _connectionString;

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, string connectionString)
            : base(options)
        {
            _connectionString = connectionString;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer(_connectionString);
            }
        }

        // DbSet для сущностей пользовательских баз данных
        public DbSet<UserWeb> UserWebs { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<SettingSetting> SettingSettings { get; set; }
        public DbSet<WorkshopType> WorkshopTypes { get; set; }
        public DbSet<SalesPoint> SalesPoints { get; set; }
        public DbSet<Branch> Branches { get; set; }
        public DbSet<SalesChannel> SalesChannels { get; set; }
        public DbSet<PrintSettings> PrintSettings { get; set; }
        public DbSet<Setting> Settings { get; set; }
        public DbSet<Street> Streets { get; set; }
        public DbSet<UnitOfMeasurement> UnitsOfMeasurement { get; set; }
        public DbSet<WriteOffReason> WriteOffReasons { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<OrderTag> OrderTags { get; set; }
        public DbSet<Status> Statuses { get; set; }
        public DbSet<Markup> Markups { get; set; }
        public DbSet<Discount> Discounts { get; set; }
        public DbSet<Certificate> Certificates { get; set; }
        public DbSet<Shift> Shifts { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<PaymentOption> PaymentOptions { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<Component> Components { get; set; }
        public DbSet<RawMaterial> RawMaterials { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            ConfigureEntities(modelBuilder);
            base.OnModelCreating(modelBuilder);
        }

        private static void ConfigureEntities(ModelBuilder modelBuilder)
        {
            // Конфигурация Product
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.Categoryid);

            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasPrecision(18, 2);

            // Конфигурация Client
            modelBuilder.Entity<Client>()
                .Property(c => c.Name)
                .IsRequired();

            modelBuilder.Entity<Client>()
                .Property(c => c.Phone)
                .IsRequired();

            // Конфигурация Shift
            modelBuilder.Entity<Shift>()
                .HasOne(s => s.Employee)
                .WithMany()
                .HasForeignKey(s => s.EmployeeId);

            // Конфигурация Certificate
            modelBuilder.Entity<Certificate>()
                .Property(c => c.Name)
                .IsRequired();

            modelBuilder.Entity<Certificate>()
                .Property(c => c.Amount)
                .HasPrecision(18, 2)
                .IsRequired();

            // Конфигурация Order
            modelBuilder.Entity<Order>()
                .Property(o => o.TotalAmount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.PaymentOption)
                .WithMany()
                .HasForeignKey(o => o.PaymentOptionId);

            // Конфигурация OrderItem
            modelBuilder.Entity<OrderItem>()
                .Property(oi => oi.Price)
                .HasPrecision(18, 2);

            modelBuilder.Entity<OrderItem>()
                .Property(oi => oi.Quantity)
                .HasPrecision(18, 2);

            // Конфигурация Discount
            modelBuilder.Entity<Discount>()
                .Property(d => d.Percentage)
                .HasPrecision(5, 2);

            // Конфигурация Markup
            modelBuilder.Entity<Markup>()
                .Property(m => m.Percentage)
                .HasPrecision(5, 2);

            // Конфигурация RawMaterial
            modelBuilder.Entity<RawMaterial>()
                .Property(r => r.Quantity)
                .HasPrecision(10, 3);
        }
    }
}