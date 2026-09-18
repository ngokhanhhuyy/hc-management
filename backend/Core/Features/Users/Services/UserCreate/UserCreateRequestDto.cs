using HCManagement.Core.Common.Dtos;

namespace HCManagement.Core.Features.Users;

public class UserCreateRequestDto : IRequestDto
{
    #region Properties
    public required string UserName { get; set; }
    public required string Password { get; set; }
    #endregion

    #region Methods
    public void TransformValues() { }
    #endregion
}
