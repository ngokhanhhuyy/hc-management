using System.Security.Authentication;
using System.Security.Claims;
using HCManagement.Core.Common.Security;

namespace HCManagement.Api.Providers;

public class CallerDetailProvider : ICallerDetailProvider
{
    #region Fields
    private int? _id;
    private string? _userName;
    #endregion
    
    #region Methods
    public void SetCallerDetail(ClaimsPrincipal principal)
    {
        try
        {
            string idAsString = principal.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new AuthenticationException();

            _id = int.Parse(idAsString);
            _userName = principal.FindFirstValue(ClaimTypes.Name) ?? throw new AuthenticationException();
        }
        catch (FormatException)
        {
            throw new AuthenticationException();
        }
    }

    public int GetId()
    {
        return _id ?? throw GenerateException();
    }

    public string GetUserName()
    {
        return _userName ?? throw GenerateException();
    }
    #endregion
    
    #region StaticMethods
    private static InvalidOperationException GenerateException()
    {
        return new("Caller detail has not been loaded yet.");
    }
    #endregion
        
}
