using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using HCManagement.Core.Features.Orders;

namespace HCManagement.Core.Persistence.DbContext;

internal class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    #region Methods
    public void Configure(EntityTypeBuilder<Order> entityBuilder)
    {
        // Relationships.
        entityBuilder
            .HasOne(o => o.CreatedUser)
            .WithMany()
            .HasForeignKey(o => o.CreatedUserId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);

        entityBuilder
            .HasOne(o => o.LastUpdatedUser)
            .WithMany()
            .HasForeignKey(o => o.LastUpdatedUserId)
            .OnDelete(DeleteBehavior.Restrict);

        entityBuilder
            .HasOne(o => o.FinishedUser)
            .WithMany()
            .HasForeignKey(o => o.FinishedUserId)
            .OnDelete(DeleteBehavior.Restrict);

        entityBuilder
            .HasOne(o => o.DeletedUser)
            .WithMany()
            .HasForeignKey(o => o.DeletedUserId)
            .OnDelete(DeleteBehavior.Restrict);

        entityBuilder
            .HasOne(o => o.Seating)
            .WithMany(s => s.Orders)
            .HasForeignKey(o => o.SeatingId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);

        // RowVersion.
        entityBuilder.Property<byte[]?>("RowVersion").IsRowVersion();
    }
    #endregion
}
