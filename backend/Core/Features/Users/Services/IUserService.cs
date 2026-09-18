namespace HCManagement.Core.Features.Users;

public interface IUserService
{
    #region Methods
    Task<UserDetailResponseDto> GetDetailByIdAsync(int id);
    Task<UserDetailResponseDto> GetDetailByUserNameAsync(string userName);
    Task<int> CreateAsync(UserCreateRequestDto requestDto);
    Task DeleteAsync(int id);
    #endregion
}
