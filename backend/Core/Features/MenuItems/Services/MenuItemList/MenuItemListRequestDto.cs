using HCManagement.Core.Common.Dtos;
using HCManagement.Core.Common.Extensions;

namespace HCManagement.Core.Features.MenuItems;

public class MenuItemListRequestDto : IListRequestDto<MenuItemListRequestDto.SortingCriterion>
{
    #region Properties
    public bool SortByAscending { get; set; } = true;
    public SortingCriterion SortByCriterion { get; set; } = SortingCriterion.Name;
    public string? SearchContent { get; set; }
    public int? CategoryId { get; set; }
    public bool DeletedIncluded { get; set; }
    #endregion

    #region Methods
    public void TransformValues()
    {
        SearchContent = SearchContent.ToNullIfEmptyOrWhiteSpace();
        CategoryId = CategoryId == 0 ? null : CategoryId;
    }
    #endregion

    #region Enums
    public enum SortingCriterion
    {
        Name,
        Category,
        DefaultAmountBeforeVatPerUnit
    }
    #endregion
}
