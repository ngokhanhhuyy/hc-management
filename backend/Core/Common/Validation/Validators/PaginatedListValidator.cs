using FluentValidation;
using HCManagement.Core.Common.Dtos;
using HCManagement.Core.Common.Localization;

namespace HCManagement.Core.Common.Validation;

internal class PaginatedListValidator<TListRequestDto, TSortingCriterion>
    : ListValidator<TListRequestDto, TSortingCriterion>
    where TListRequestDto : IPaginatedListRequestDto<TSortingCriterion>
    where TSortingCriterion : struct, Enum
{
    #region Constructors
    public PaginatedListValidator(
        int pageMinValue = 1,
        int resultsPerPageMinValue = 5,
        int resultsPerPageMaxValue = 50) : base()
    {
        RuleFor(dto => dto.Page)
            .GreaterThanOrEqualTo(pageMinValue)
            .WithName(DisplayNames.Page);
        RuleFor(dto => dto.ResultsPerPage)
            .GreaterThanOrEqualTo(resultsPerPageMinValue)
            .LessThanOrEqualTo(resultsPerPageMaxValue)
            .WithName(DisplayNames.ResultsPerPage);
    }
    #endregion
}
