using HCManagement.Core.Common.Dtos;

namespace HCManagement.Core.Features.Users;

public class UserBasicResponseDto : IResponseDto
{
    #region Constructors
    internal UserBasicResponseDto(User user)
    {
        Id = user.Id;
        UserName = user.UserName;
        IsDeleted = user.DeletedDateTime is not null;
    }
    #endregion

    #region Properties
    public int Id { get; set; }
    public string UserName { get; set; }
    public bool IsDeleted { get; set; }
    #endregion
}
