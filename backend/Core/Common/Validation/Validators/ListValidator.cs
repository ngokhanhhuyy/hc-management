using FluentValidation;
using HCManagement.Core.Common.Dtos;
using HCManagement.Core.Common.Localization;

namespace HCManagement.Core.Common.Validation;

internal class ListValidator<TListRequestDto, TFieldToSort> : Validator<TListRequestDto>
    where TListRequestDto : IListRequestDto
    where TFieldToSort : struct, Enum
{
    #region Constructors
    public ListValidator(
        int pageMinValue = 1,
        int resultsPerPageMinValue = 5,
        int resultsPerPageMaxValue = 50)
    {
        RuleFor(dto => dto.SortByFieldName)
            .IsOneOfFieldsToSort<TListRequestDto, TFieldToSort>()
            .WithName(DisplayNames.SortByFieldName);
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
