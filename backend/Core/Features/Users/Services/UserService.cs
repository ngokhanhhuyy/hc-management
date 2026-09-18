using FluentValidation;
using HCManagement.Core.Common.Exceptions;
using HCManagement.Core.Common.Localization;
using HCManagement.Core.Common.Security;
using HCManagement.Core.Persistence.DbContext;
using HCManagement.Core.Persistence.Handlers;
using Microsoft.EntityFrameworkCore;
using System.Data.Common;

namespace HCManagement.Core.Features.Users;

internal class UserService : IUserService
{
    #region Fields
    private readonly AppDbContext _context;
    private readonly IValidator<UserCreateRequestDto> _createValidator;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IDbExceptionHandler _dbExceptionHandler;
    #endregion

    #region Constructors
    public UserService(
        AppDbContext context,
        IValidator<UserCreateRequestDto> createValidator,
        IPasswordHasher passwordHasher,
        IDbExceptionHandler dbExceptionHandler)
    {
        _context = context;
        _createValidator = createValidator;
        _passwordHasher = passwordHasher;
        _dbExceptionHandler = dbExceptionHandler;
    }
    #endregion

    #region Methods
    public async Task<UserDetailResponseDto> GetDetailByIdAsync(int id)
    {
        return await _context.Users
            .Where(u => u.Id == id && u.DeletedDateTime == null)
            .Select(u => new UserDetailResponseDto(u))
            .SingleOrDefaultAsync()
            ?? throw new NotFoundException();
    }

    public async Task<UserDetailResponseDto> GetDetailByUserNameAsync(string userName)
    {
        return await _context.Users
            .Where(u => u.UserName == userName && u.DeletedDateTime == null)
            .Select(u => new UserDetailResponseDto(u))
            .SingleOrDefaultAsync()
            ?? throw new NotFoundException();
    }

    public async Task<int> CreateAsync(UserCreateRequestDto requestDto)
    {
        _createValidator.ValidateAndThrow(requestDto);

        User user = new()
        {
            UserName = requestDto.UserName,
            PasswordHash = _passwordHasher.HashPassword(requestDto.Password)
        };

        _context.Users.Add(user);

        try
        {
            await _context.SaveChangesAsync();
            return user.Id;
        }
        catch (DbUpdateException exception)
        {
            Common.Exceptions.ApplicationException? convertedException = ConvertDbUpdateException(exception);
            if (convertedException is null)
            {
                throw;
            }

            throw convertedException;
        }
    }

    public async Task DeleteAsync(int id)
    {
        try
        {
            await _context.Users
                .Where(u => u.Id == id && u.DeletedDateTime == null)
                .ExecuteDeleteAsync();
        }
        catch (DbException exception)
        {
            Common.Exceptions.ApplicationException? convertedException = ConvertDbException(exception);
            if (convertedException is null)
            {
                throw;
            }

            throw convertedException;
        }
    }
    #endregion

    #region PrivateMethods
    private Common.Exceptions.ApplicationException? ConvertDbUpdateException(DbUpdateException exception)
    {
        DbExceptionHandledResult? handledResult = _dbExceptionHandler.Handle(exception);
        return ConvertHandledResult(handledResult);
    }

    private Common.Exceptions.ApplicationException? ConvertDbException(DbException exception)
    {
        DbExceptionHandledResult? handledResult = _dbExceptionHandler.Handle(exception);
        return ConvertHandledResult(handledResult);
    }
    #endregion

    #region PrivateStaticMethods
    private static Common.Exceptions.ApplicationException? ConvertHandledResult(DbExceptionHandledResult? handledResult)
    {
        if (handledResult is null)
        {
            return null;
        }

        if (handledResult.IsConcurrencyConflict)
        {
            return new ConcurrencyException();
        }

        if (handledResult.IsUniqueConstraintViolation)
        {
            return OperationException.Duplicated(
                new object[] { nameof(User.UserName) },
                DisplayNames.UserName);
        }

        return null;
    }
    #endregion
}
