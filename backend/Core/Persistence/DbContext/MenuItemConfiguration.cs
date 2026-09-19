using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using HCManagement.Core.Features.MenuItems;

namespace HCManagement.Core.Persistence.DbContext;

internal class MenuItemConfiguration : IEntityTypeConfiguration<MenuItem>
{
    #region Methods
    public void Configure(EntityTypeBuilder<MenuItem> entityBuilder)
    {
        // Index.
        entityBuilder.HasIndex(mi => mi.Name).IsUnique();

        // Relationships.
        entityBuilder
            .HasOne(mi => mi.Category)
            .WithMany(mc => mc.Items)
            .HasForeignKey(mi => mi.CategoryId)
            .OnDelete(DeleteBehavior.SetNull);

        // RowVersion.
        entityBuilder.Property<byte[]?>("RowVersion").IsRowVersion();
    }
    #endregion
}
