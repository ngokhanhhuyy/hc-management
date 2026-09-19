using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace HCManagement.Core.Persistence.Handlers;

internal interface IDbExceptionHandler
{
    #region Methods
    DbExceptionHandledResult? Handle(DbUpdateException exception);
    DbExceptionHandledResult? Handle(DbException exception);
    DbExceptionHandledResult? Handle(Exception exception);
    #endregion
}
