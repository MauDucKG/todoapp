using Microsoft.EntityFrameworkCore;
using ToDoList_API.Models;

namespace ToDoList_API.Data
{
    public class ToDoListApiDbContext : DbContext
    {
        public ToDoListApiDbContext(DbContextOptions<ToDoListApiDbContext> options) : base(options)
        {
        }

        public DbSet<ToDoList> ToDoLists { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ToDoList>(entity =>
            {
                entity.OwnsOne(e => e.EstimatedTime);
                entity.HasOne(e => e.User)
                    .WithMany(e => e.ToDoLists)
                    .HasForeignKey(e => e.UserID)
                    .HasPrincipalKey(e => e.ID)
                    .IsRequired();
            });
        }
    }
}
