using HCManagement.Core.Common.Dtos;

namespace HCManagement.Core.Features.MenuCategories;

public class MenuCategoryUpsertRequestDto : IRequestDto
{
    #region Properties
    public required string Name { get; set; }
    #endregion

    #region Methods
    public void TransformValues()
    {
        Name = Name.Trim();
    }
    #endregion
}
