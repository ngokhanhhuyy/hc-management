using HCManagement.Core.Common.Dtos;

namespace HCManagement.Core.Features.MenuCategories;

public class MenuCategoryUpsertRequestDto : IRequestDto
{
    #region Properties
    public required string Name { get; set; }
    public int? Index { get; set; }
    #endregion

    #region Methods
    public void TransformValues()
    {
        Name = Name.Trim();
        Index = Index == 0 ? null : Index;
    }
    #endregion
}
