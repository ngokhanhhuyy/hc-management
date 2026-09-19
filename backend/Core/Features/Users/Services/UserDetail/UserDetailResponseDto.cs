namespace HCManagement.Core.Features.Users;

public class UserDetailResponseDto
{
    #region Constructors
    internal UserDetailResponseDto(User user)
    {
        Id = user.Id;
        UserName = user.UserName;
        DeletedDateTime = user.DeletedDateTime;
    }
    #endregion

    #region Properties
    public int Id { get; set; }
    public string UserName { get; set; }
    public DateTime? DeletedDateTime { get; set; }
    #endregion
}
