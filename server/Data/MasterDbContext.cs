using FluxÆther.Models;
using Microsoft.EntityFrameworkCore;

namespace FluxÆther.Data
{
    public class MasterDbContext : DbContext
    {
        public MasterDbContext(DbContextOptions<MasterDbContext> options) : base(options) { }

        // Таблица для хранения информации о пользователях
        public DbSet<UserWeb> UserWebs { get; set; }

        // Таблица для хранения информации о базах данных пользователей
        public DbSet<UserDatabase> UserDatabases { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Конфигурация таблицы UserWeb
            modelBuilder.Entity<UserWeb>(entity =>
            {
                entity.Property(u => u.Username)
                    .IsRequired();

                entity.Property(u => u.PasswordHash)
                    .IsRequired();
            });

            // Конфигурация таблицы UserDatabases
            modelBuilder.Entity<UserDatabase>(entity =>
            {
                entity.HasKey(e => e.Id); // Устанавливаем первичный ключ
                entity.Property(e => e.UserId).IsRequired(); // Поле UserId обязательно
                entity.Property(e => e.DatabaseName).IsRequired(); // Поле DatabaseName обязательно
                entity.Property(e => e.ConnectionString).IsRequired(); // Поле ConnectionString обязательно
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}