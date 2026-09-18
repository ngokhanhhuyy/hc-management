using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using HCManagement.Core.Features.Users;

namespace HCManagement.Core.Persistence.DbContext;

internal class UserEntityConfiguration : IEntityTypeConfiguration<User>
{
    #region Methods
    public void Configure(EntityTypeBuilder<User> entityBuilder)
    {
        // Index.
        entityBuilder.HasIndex(p => p.UserName).IsUnique();

        // RowVersion.
        entityBuilder.Property<byte[]?>("RowVersion").IsRowVersion();
    }
    #endregion
}
