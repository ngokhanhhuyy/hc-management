using Microsoft.AspNetCore.Mvc.Routing;

namespace HCManagement.Api.Attributes;

[AttributeUsage(AttributeTargets.Method, AllowMultiple = true, Inherited = true)]
public sealed class HttpQueryAttribute : HttpMethodAttribute
{
    private static readonly IEnumerable<string> SupportedMethods =
        ["QUERY"];

    public HttpQueryAttribute()
        : base(SupportedMethods)
    {
    }

    public HttpQueryAttribute(string template)
        : base(SupportedMethods, template)
    {
    }
}
