using System.Globalization;
using System.Text;

namespace HCManagement.Core.Common.Extensions;

public static class StringExtensions
{
    #region Extensions
    extension(string? value)
    {
        public string? ToNullIfEmptyOrWhiteSpace()
        {
            return string.IsNullOrWhiteSpace(value?.Trim()) ? null : value.Trim();
        }
    }

    extension(string value)
    {
        public string ReplaceResourceName(string resouceDisplayName)
        {
            return value.Replace("{ResourceName}", resouceDisplayName);
        }

        public string ReplacePropertyName(string propertyDisplayName)
        {
            return value.Replace("{PropertyName}", propertyDisplayName);
        }

        public string ReplaceAttemptedValue(string attemptedValue)
        {
            return value.Replace("{AttemptedValue}", attemptedValue);
        }

        public string ReplaceComparisonValue(string comparisonValue)
        {
            return value.Replace("{ComparisonValue}", comparisonValue);
        }

        public string ToNonDiacritics()
        {
            string normalizedString = value.Normalize(NormalizationForm.FormD);
            StringBuilder stringBuilder = new();
        
            foreach (Rune rune in normalizedString.EnumerateRunes())
            {
                var unicodeCategory = Rune.GetUnicodeCategory(rune);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    stringBuilder.Append(rune);
                }
            }
        
            return stringBuilder
                .ToString()
                .Normalize(NormalizationForm.FormC)
                .Replace('đ', 'd')
                .Replace('Đ', 'D')
                .Replace('Ð', 'D');
        }
    }
    #endregion
}
