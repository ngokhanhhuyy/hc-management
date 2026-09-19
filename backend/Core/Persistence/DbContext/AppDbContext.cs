using Humanizer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using HCManagement.Core.Features.MenuCategories;
using HCManagement.Core.Features.MenuItems;
using HCManagement.Core.Features.Users;
using System.Text.RegularExpressions;

namespace HCManagement.Core.Persistence.DbContext;

internal partial class AppDbContext : Microsoft.EntityFrameworkCore.DbContext
{
    #region Constructors
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    #endregion
    
    #region Properties
    public DbSet<MenuCategory> MenuCategories { get; set; }
    public DbSet<MenuItem> MenuItems { get; set; }
    public DbSet<User> Users { get; set; }
    #endregion
    
    #region Methods
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User-cluster entities.
        modelBuilder.ApplyConfiguration(new UserEntityConfiguration());
        modelBuilder.ApplyConfiguration(new MenuCategoryConfiguration());
        modelBuilder.ApplyConfiguration(new MenuItemConfiguration());

        // Configure identifiers' names.
        ConfigureIdentifierNames(modelBuilder);
    }
    #endregion
    
    #region PrivateMethods#region PrivateMethods
    private static void ConfigureIdentifierNames(ModelBuilder modelBuilder, bool useSnakeCase = false)
    {
        string separator = useSnakeCase ? "__" : "_";
        // Set default naming convention for all models.
        foreach (IMutableEntityType entity in modelBuilder.Model.GetEntityTypes())
        {
            // Set primary keys' names.
            foreach (IMutableKey key in entity.GetKeys())
            {
                if (!key.IsPrimaryKey())
                {
                    continue;
                }

                string tableName = entity.GetTableName()!;
                if (useSnakeCase)
                {
                    tableName = tableName.Underscore();
                }

                IEnumerable<string> columnNames = key.Properties.Select(p => useSnakeCase
                    ? ReplaceSnakeCaseSpecialWords(p.Name.Underscore())
                    : p.Name);

                key.SetName("PK" + separator + tableName + separator + string.Join(separator, columnNames));
            }

            // Set foreign keys' constraint _names.
            foreach (IMutableForeignKey foreignKey in entity.GetForeignKeys())
            {
                string referencingTable = OmitAspNetPrefix(foreignKey.PrincipalEntityType.GetTableName()!);
                string referencedTable = OmitAspNetPrefix(foreignKey.DeclaringEntityType.GetTableName()!);
                if (useSnakeCase)
                {
                    referencingTable = referencingTable.Underscore();
                    referencedTable = referencedTable.Underscore();
                }
                
                string referencingColumns = string.Join(
                    separator,
                    foreignKey.Properties.Select(p =>
                    {
                        if (useSnakeCase && p.Name.Any(char.IsUpper))
                        {
                            return ReplaceSnakeCaseSpecialWords(p.Name.Underscore());
                        }

                        return p.Name;
                    }));
                    
                foreignKey.SetConstraintName(
                    $"FK{separator}{referencingTable}{separator}{referencedTable}{separator}{referencingColumns}");
            }

            // Change index names
            foreach (IMutableIndex index in entity.GetIndexes())
            {
                List<string> indexElementNames = new() { index.IsUnique ? "UNIQUE" : "INDEX" };
                string aspNetPrefixOmittedTableName = OmitAspNetPrefix(index.DeclaringEntityType.GetTableName()!);
                if (useSnakeCase)
                {
                    indexElementNames.Add(aspNetPrefixOmittedTableName.Underscore());
                }
                else
                {
                    indexElementNames.Add(aspNetPrefixOmittedTableName);
                }
                
                indexElementNames.AddRange(
                    index.Properties.Select(p => useSnakeCase
                        ? ReplaceSnakeCaseSpecialWords(p.Name.Underscore())
                        : p.Name));

                string indexName = string.Join(separator, indexElementNames);
                index.SetDatabaseName(indexName);
            }
        }
    }
    #endregion
    
    #region StaticMethods
    private static string ReplaceSnakeCaseSpecialWords(string name)
    {
        Dictionary<string, string> wordPairs = new()
        {
            { "user_name", "username" },
            { "date_time", "datetime" }
        };

        string resultName = name;
        foreach (KeyValuePair<string, string> pair in wordPairs)
        {
            resultName = resultName.Replace(pair.Key, pair.Value);
        }

        return resultName;
    }

    private static string OmitAspNetPrefix(string name)
    {
        return GetIdentityTableNameRegex().Replace(name, "");
    }
    
    [GeneratedRegex("^(AspNet)")]
    private static partial Regex GetIdentityTableNameRegex();
    #endregion
}
