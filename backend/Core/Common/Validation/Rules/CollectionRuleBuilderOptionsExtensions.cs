using FluentValidation;
using HCManagement.Core.Common.Localization;

namespace HCManagement.Core.Common.Validation;

internal static partial class CollectionRuleBuilderOptionsExtensions
{
    #region ExtensionMethods
    extension<T, TItem>(IRuleBuilder<T, List<TItem>?> ruleBuilder) where TItem : class
    {
        public IRuleBuilderOptions<T, List<TItem>?> Unique<TProperty>(Func<TItem, TProperty> propertySelector)
        {
            return ruleBuilder
                .Must((items) =>
                {
                    if (items is null)
                    {
                        return true;
                    }

                    return !items.GroupBy(propertySelector).Any(i => i.Count() > 1);
                })
                .WithMessage(ErrorMessages.Duplicated);
        }
    }
    #endregion
}
