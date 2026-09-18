using FluentValidation;
using HCManagement.Core.Common.Localization;
using HCManagement.Core.Common.Validation;

namespace HCManagement.Core.Features.Users;

internal class UserCreateValidator : Validator<UserCreateRequestDto>
{
    #region Constructors
    public UserCreateValidator()
    {
        RuleFor(dto => dto.UserName)
            .NotEmpty()
            .MaximumLength(UserContracts.UserNameMaxLength)
            .Matches("^[a-zA-Z0-9_-]+$").WithMessage(ErrorMessages.InvalidUserNamePattern)
            .WithName(dto => DisplayNames.UserName);
        RuleFor(dto => dto.Password)
            .NotEmpty()
            .IsValidPassword()
            .WithName(DisplayNames.Password);
    }
    #endregion
}
