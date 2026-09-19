using HCManagement.Core.Common.Dtos;

namespace HCManagement.Core.Features.Authentication;

public class VerifyCredentialsRequestDto : IRequestDto
{
    #region Properties
    public required string UserName { get; set; }
    public required string Password { get; set; }
    #endregion

    #region Methods
    public void TransformValues()
    {
        UserName = UserName.Trim();
        Password = Password.Trim();
    }
    #endregion
}
