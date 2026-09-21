using HCManagement.Core.Common.Dtos;

namespace HCManagement.Core.Features.MenuItems;

public class MenuItemUpsertRequestDto : IRequestDto
{
    #region Properties
    public required string Name { get; set; }
    public required string Unit { get; set; }
    public required long DefaultAmountBeforeVatPerUnit { get; set; }
    public required int DefaultVatPercentagePerUnit { get; set; }
    public required int? CategoryId { get; set; }
    #endregion

    #region Methods
    public void TransformValues()
    {
        Name = Name.Trim();
        CategoryId = CategoryId == 0 ? null : CategoryId;
    }
    #endregion
}
