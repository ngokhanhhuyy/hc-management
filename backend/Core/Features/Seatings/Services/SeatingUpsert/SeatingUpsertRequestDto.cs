using HCManagement.Core.Common.Dtos;

namespace HCManagement.Core.Features.Seatings;

public class SeatingUpsertRequestDto : IRequestDto
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
