using FluentValidation;
using HCManagement.Core.Common.Localization;
using HCManagement.Core.Common.Validation;

namespace HCManagement.Core.Features.Reports;

internal class ReportFigureValidator : Validator<ReportFigureRequestDto>
{
    #region Constructors
    public ReportFigureValidator()
    {
        RuleFor(dto => dto.Period)
            .IsInEnum()
            .WithName(DisplayNames.Period);
    }
    #endregion
}
