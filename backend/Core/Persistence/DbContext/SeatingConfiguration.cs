using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using HCManagement.Core.Features.Seatings;

namespace HCManagement.Core.Persistence.DbContext;

internal class SeatingConfiguration : IEntityTypeConfiguration<Seating>
{
    #region Methods
    public void Configure(EntityTypeBuilder<Seating> entityBuilder)
    {
        // Index.
        entityBuilder.HasIndex(s => s.Name).IsUnique();

        // RowVersion.
        entityBuilder.Property<byte[]?>("RowVersion").IsRowVersion();
    }
    #endregion
}
