using FluentValidation;
using HCManagement.Core.Common.Dtos;
using HCManagement.Core.Common.Localization;

namespace HCManagement.Core.Common.Validation;

internal class ListValidator<TListRequestDto, TSortingCriterion> : Validator<TListRequestDto>
    where TListRequestDto : IListRequestDto<TSortingCriterion>
    where TSortingCriterion : struct, Enum
{
    #region Constructors
    public ListValidator()
    {
        RuleFor(dto => dto.SortByCriterion)
            .IsInEnum()
            .WithName(DisplayNames.SortByFieldName);
    }
    #endregion
}
