using HCManagement.Core.Common.Dtos;

namespace HCManagement.Core.Features.Authentication;

public class ChangePasswordRequestDto : IRequestDto
{
    #region Properties
    public required string CurrentPassword { get; set; }
    public required string NewPassword { get; set; }
    #endregion

    #region Methods
    public void TransformValues()
    {
        CurrentPassword = CurrentPassword.Trim();
        NewPassword = NewPassword.Trim();
    }
    #endregion
}
