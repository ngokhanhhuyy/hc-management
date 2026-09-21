using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using HCManagement.Core.Features.Orders;

namespace HCManagement.Core.Persistence.DbContext;

internal class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    #region Methods
    public void Configure(EntityTypeBuilder<OrderItem> entityBuilder)
    {
        // Relationships.
        entityBuilder
            .HasOne(oi => oi.Order)
            .WithMany(o => o.Items)
            .HasForeignKey(oi => oi.OrderId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

        entityBuilder
            .HasOne(oi => oi.MenuItem)
            .WithMany(mi => mi.OrderItems)
            .HasForeignKey(oi => oi.MenuItemId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes.
        entityBuilder
            .HasIndex(mi => new { mi.OrderId, mi.MenuItemId })
            .IsUnique();

        // RowVersion.
        entityBuilder.Property<byte[]?>("RowVersion").IsRowVersion();
    }
    #endregion
}
