using HCManagement.Core.Features.MenuItems;
using System.ComponentModel.DataAnnotations;

namespace HCManagement.Core.Features.MenuCategories;

internal class MenuCategory
{
    #region Properties
    [Key]
    public int Id { get; private set; }

    [Required]
    [StringLength(MenuCategoryContracts.NameMaxLength)]
    public required string Name { get; set; }

    public int? Index { get; set; }
    #endregion

    #region NavigationProperties
    public List<MenuItem> Items { get; set; } = new();
    #endregion
}
