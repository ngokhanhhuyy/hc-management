namespace HCManagement.Core.Features.Authentication;

public class ChangePasswordRequestDto
{
    #region Properties
    [Required]
    public required string NewPassword { get; set; }
    #endregion
}
