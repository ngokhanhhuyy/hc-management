using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using HCManagement.Core.Features.MenuCategories;

namespace HCManagement.Core.Persistence.DbContext;

internal class MenuCategoryConfiguration : IEntityTypeConfiguration<MenuCategory>
{
    #region Methods
    public void Configure(EntityTypeBuilder<MenuCategory> entityBuilder)
    {
        // Index.
        entityBuilder.HasIndex(mc => mc.Name).IsUnique();
        entityBuilder.HasIndex(mc => mc.Index);

        // RowVersion.
        entityBuilder.Property<byte[]?>("RowVersion").IsRowVersion();
    }
    #endregion
}
