using FluentValidation;
using FluentValidation.Results;
using HCManagement.Core.Common.Dtos;

namespace HCManagement.Core.Common.Validation;

public class Validator<TRequestDto> : AbstractValidator<TRequestDto> where TRequestDto : IRequestDto
{
    #region Constructors
    protected Validator()
    {
        ClassLevelCascadeMode = CascadeMode.Continue;
        RuleLevelCascadeMode = CascadeMode.Stop;
    }
    #endregion

    #region Methods
    protected override bool PreValidate(ValidationContext<TRequestDto> context, ValidationResult result)
    {
        context.InstanceToValidate?.TransformValues();
        return base.PreValidate(context, result);
    }
    #endregion
}
