using HCManagement.Core.Common.Dtos;

namespace HCManagement.Core.Features.Users;

public class UserBasicResponseDto : IResponseDto
{
    #region Constructors
    public UserBasicResponseDto(User user)
    {
        Id = user.Id;
        UserName = user.UserName;
    }
    #endregion

    #region Properties
    public int Id { get; set; }
    public string UserName { get; set; }
    #endregion
}
