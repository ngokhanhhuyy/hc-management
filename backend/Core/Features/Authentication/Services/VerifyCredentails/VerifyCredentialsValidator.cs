using FluentValidation;
using JetBrains.Annotations;
using HCManagement.Core.Common.Localization;
using HCManagement.Core.Common.Validation;

namespace HCManagement.Core.Features.Authentication;

[UsedImplicitly]
internal class VerifyCredentialsValidator : Validator<VerifyCredentialsRequestDto>
{
    #region Constructors
    public VerifyCredentialsValidator()
    {
        RuleFor(dto => dto.UserName)
            .NotEmpty()
            .WithName(DisplayNames.UserName);
        RuleFor(dto => dto.Password)
            .NotEmpty()
            .WithName(DisplayNames.Password);
    }
    #endregion
}
