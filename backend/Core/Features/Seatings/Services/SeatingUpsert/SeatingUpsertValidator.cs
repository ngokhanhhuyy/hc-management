using FluentValidation;
using HCManagement.Core.Common.Localization;
using HCManagement.Core.Common.Validation;

namespace HCManagement.Core.Features.Seatings;

internal class SeatingUpsertValidator : Validator<SeatingUpsertRequestDto>
{
    #region Constructors
    public SeatingUpsertValidator()
    {
        RuleFor(dto => dto.Name)
            .NotEmpty()
            .IsValidName()
            .MaximumLength(SeatingContracts.NameMaxLength)
            .WithName(DisplayNames.Seating);
    }
    #endregion
}
