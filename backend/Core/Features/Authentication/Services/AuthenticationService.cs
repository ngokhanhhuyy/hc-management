using FluentValidation;
using Microsoft.EntityFrameworkCore;
using HCManagement.Core.Common.Exceptions;
using HCManagement.Core.Common.Extensions;
using HCManagement.Core.Common.Localization;
using HCManagement.Core.Common.Security;
using HCManagement.Core.Features.Users;
using HCManagement.Core.Persistence.DbContext;
using HCManagement.Core.Persistence.Handlers;

namespace HCManagement.Core.Features.Authentication;

internal class AuthenticationService : IAuthenticationService
{
    #region Fields
    private readonly AppDbContext _context;
    private readonly IValidator<VerifyCredentialsRequestDto> _verifyCredentialsValidator;
    private readonly IValidator<ChangePasswordRequestDto> _changePasswordValidator;
    private readonly ICallerDetailProvider _callerDetailProvider;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IDbExceptionHandler _exceptionHandler;
    #endregion
    
    #region Constructors
    public AuthenticationService(
        AppDbContext context,
        IValidator<VerifyCredentialsRequestDto> verifyCredentialsValidator,
        IValidator<ChangePasswordRequestDto> changePasswordValidator,
        ICallerDetailProvider callerDetailProvider,
        IPasswordHasher passwordHasher,
        IDbExceptionHandler exceptionHandler)
    {
        _context = context;
        _verifyCredentialsValidator = verifyCredentialsValidator;
        _changePasswordValidator = changePasswordValidator;
        _callerDetailProvider = callerDetailProvider;
        _passwordHasher = passwordHasher;
        _exceptionHandler = exceptionHandler;
    } 
    #endregion
    
    #region Methods
    public async Task VerifyCredentialsAsync(VerifyCredentialsRequestDto requestDto)
    {
        requestDto.TransformValues();
        _verifyCredentialsValidator.ValidateAndThrow(requestDto);
        
        string passwordHash = await _context.Users
            .Where(u => u.UserName == requestDto.UserName && u.DeletedDateTime == null)
            .Select(u => u.PasswordHash)
            .SingleOrDefaultAsync()
            ?? throw new OperationException(
               new object[] { nameof(requestDto.UserName) },
               ErrorMessages.NotFound.ReplaceResourceName(DisplayNames.User)
            );
        
        bool isPasswordCorrect = _passwordHasher.VerifyPassword(requestDto.Password, passwordHash);
        if (!isPasswordCorrect)
        {
            throw new OperationException(
                new object[] { nameof(requestDto.Password) },
                ErrorMessages.Incorrect.ReplacePropertyName(DisplayNames.Password)
            );
        }
    }

    public async Task ChangePasswordAsync(ChangePasswordRequestDto requestDto)
    {
        requestDto.TransformValues();
        _changePasswordValidator.ValidateAndThrow(requestDto);

        int callerId = _callerDetailProvider.GetId();
        User user = await _context.Users
            .Where(u => u.Id == callerId && u.DeletedDateTime == null)
            .SingleOrDefaultAsync()
            ?? throw new NotFoundException();
        
        if (!_passwordHasher.VerifyPassword(requestDto.CurrentPassword, user.PasswordHash))
        {
            throw new OperationException(
                new object[] { nameof(requestDto.CurrentPassword) },
                ErrorMessages.Incorrect.ReplacePropertyName(DisplayNames.CurrentPassword)
            );
        }
        
        string newPasswordHash = _passwordHasher.HashPassword(requestDto.NewPassword);
        user.PasswordHash = newPasswordHash;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException exception)
        {
            DbExceptionHandledResult? handledResult = _exceptionHandler.Handle(exception);
            if (handledResult is null)
            {
                throw;
            }

            if (handledResult.IsConcurrencyConflict)
            {
                throw new ConcurrencyException();
            }

            throw;
        }
    }
    #endregion
}
