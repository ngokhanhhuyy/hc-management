using FluentValidation;
using HCManagement.Core.Common.Localization;
using HCManagement.Core.Features.Authentication;
using System.Text.RegularExpressions;

namespace HCManagement.Core.Common.Validation;

internal static partial class StringRuleBuilderOptionsExtensions
{
    #region ExtensionMethods
    extension<T>(IRuleBuilder<T, string?> ruleBuilder)
    {
        public IRuleBuilderOptions<T, string?> IsValidName()
        {
            return ruleBuilder.Matches(GetNameRegex());
        }
    }

    extension<T>(IRuleBuilder<T, string> ruleBuilder)
    {
        public IRuleBuilderOptions<T, string> IsValidPassword()
        {
            return ruleBuilder
                .MinimumLength(AuthenticationContracts.PasswordMinLength)
                .Matches(GetPasswordRegex());
        }
    }
    #endregion

    #region StaticMethods
    [GeneratedRegex(@"^[A-Za-z0-9 ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸỳỵỷỹ]+$")]
    private static partial Regex GetNameRegex();

    [GeneratedRegex(@"^[\x21-\x7E]+$")]
    private static partial Regex GetPasswordRegex();
    #endregion
}
