using Microsoft.EntityFrameworkCore;

namespace api.models
{
    public class InsuranceDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Policy> Policies { get; set; }
        public InsuranceDbContext(DbContextOptions options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Vehicle>()
                        .HasOne<User>(vehicle => vehicle.Owner)
                        .WithMany(user => user.Vehicles)
                        .IsRequired()
                        .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Policy>()
                        .HasOne<Vehicle>(policy => policy.Vehicle)
                        .WithMany(vehicle => vehicle.Policies)
                        .IsRequired()
                        .OnDelete(DeleteBehavior.Cascade);
        }
    }
}