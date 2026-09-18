namespace HCManagement.Core.Features.Authentication;

public interface IAuthenticationService
{
    #region Methods
    Task VerifyCredentialsAsync(VerifyCredentialsRequestDto requestDto);
    Task CheckStatusAsync();
    Task ChangePasswordAsync(ChangePasswordRequestDto requestDto);
    #endregion
}
