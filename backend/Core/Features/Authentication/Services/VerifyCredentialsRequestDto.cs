namespace HCManagement.Core.Features.Authentication;

public class VerifyCredentialsRequestDto
{
    #region Properties
    public required string UserName { get; set; }
    public required string Password { get; set; }
    #endregion
}
