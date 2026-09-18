namespace HCManagement.Core.Features.Authentication;

public class ChangePasswordRequestDto
{
    #region Properties
    public required string CurrentPassword { get; set; }
    public required string NewPassword { get; set; }
    #endregion
}
