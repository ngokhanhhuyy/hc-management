namespace HCManagement.Core.Common.Security;

public interface ICallerDetailProvider
{
    #region Methods
    int GetId();
    string GetUserName();
    #endregion
}
