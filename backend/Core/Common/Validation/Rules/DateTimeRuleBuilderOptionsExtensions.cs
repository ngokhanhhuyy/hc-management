using FluentValidation;
using HCManagement.Core.Common.Extensions;
using HCManagement.Core.Common.Localization;

namespace HCManagement.Core.Common.Validation;

internal static class DateTimeRuleBuilderOptionsExtensions
{
    #region ExtensionMethods
    extension<T>(IRuleBuilder<T, DateTime?> ruleBuilder)
    {
        public IRuleBuilderOptions<T, DateTime?> LaterThanDateTime(DateTime comparisonDateTime)
        {
            string errorMessage = ErrorMessages.LaterThan
                .ReplaceComparisonValue(comparisonDateTime.ToVietnameseString());
            return ruleBuilder.GreaterThan(comparisonDateTime).WithMessage(errorMessage);
        }
        
        public IRuleBuilderOptions<T, DateTime?> LaterThanOrEqualToDateTime(DateTime comparisonDateTime)
        {
            string errorMessage = ErrorMessages.GreaterThanOrEqual
                .ReplaceComparisonValue(comparisonDateTime.ToVietnameseString());
            return ruleBuilder
                .GreaterThanOrEqualTo(comparisonDateTime)
                .WithMessage(errorMessage);
        }
        
        public IRuleBuilderOptions<T, DateTime?> EarlierThanOrEqualToNow()
        {
            DateTime currentDateTime = DateTime.UtcNow.ToApplicationTime();
            string errorMessage = ErrorMessages.EarlierThanOrEqualToNow
                .ReplaceComparisonValue(currentDateTime.ToVietnameseString());
            return ruleBuilder.LessThanOrEqualTo(currentDateTime).WithMessage(errorMessage);
        }
    }
    #endregion
}
