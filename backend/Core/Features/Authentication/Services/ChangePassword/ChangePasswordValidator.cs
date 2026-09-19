using FluentValidation;
using JetBrains.Annotations;
using HCManagement.Core.Common.Localization;
using HCManagement.Core.Common.Validation;

namespace HCManagement.Core.Features.Authentication;

[UsedImplicitly]
internal class ChangePasswordValidator : Validator<ChangePasswordRequestDto>
{
    #region Constructors
    public ChangePasswordValidator()
    {
        RuleFor(dto => dto.CurrentPassword)
            .NotEmpty()
            .WithName(DisplayNames.CurrentPassword);
        RuleFor(dto => dto.NewPassword)
            .IsValidPassword()
            .WithName(DisplayNames.NewPassword);
    }
    #endregion
}
