using FluentValidation;
using HCManagement.Core.Common.Exceptions;
using HCManagement.Core.Common.Localization;
using HCManagement.Core.Persistence.DbContext;
using HCManagement.Core.Persistence.Handlers;
using Microsoft.EntityFrameworkCore;

namespace HCManagement.Core.Features.Seatings;

internal class SeatingService : ISeatingService
{
    #region Fields
    private readonly AppDbContext _context;
    private readonly IValidator<SeatingUpsertRequestDto> _validator;
    private readonly IDbExceptionHandler _dbExceptionHandler;
    #endregion

    #region Constructors
    public SeatingService(
        AppDbContext context,
        IValidator<SeatingUpsertRequestDto> validator,
        IDbExceptionHandler dbExceptionHandler)
    {
        _context = context;
        _validator = validator;
        _dbExceptionHandler = dbExceptionHandler;
    }
    #endregion

    #region Methods
    public async Task<List<SeatingBasicResponseDto>> GetAllAsync()
    {
        return await _context.Seatings
            .Include(Seating.ActiveOrderFilterExpression)
            .Where(s => !s.IsDeleted)
            .Select(s => new SeatingBasicResponseDto(s))
            .ToListAsync();
    }

    public async Task<SeatingDetailResponseDto> GetDetailAsync(int id)
    {
        return await _context.Seatings
            .Include(Seating.ActiveOrderFilterExpression)
            .Where(s => s.Id == id && !s.IsDeleted)
            .Select(s => new SeatingDetailResponseDto(s))
            .SingleOrDefaultAsync()
            ?? throw new NotFoundException();
    }

    public async Task<int> CreateAsync(SeatingUpsertRequestDto requestDto)
    {
        _validator.ValidateAndThrow(requestDto);

        Seating seating = new()
        {
            Name = requestDto.Name
        };

        _context.Seatings.Add(seating);

        try
        {
            await _context.SaveChangesAsync();
            return seating.Id;
        }
        catch (Exception exception)
        {
            CoreException? convertedException = ConvertException(exception);
            if (convertedException is null)
            {
                throw;
            }

            throw convertedException;
        }
    }

    public async Task UpdateAsync(int id, SeatingUpsertRequestDto requestDto)
    {
        _validator.ValidateAndThrow(requestDto);

        try
        {
            int updatedRecordCount = await _context.Seatings
                .Where(s => s.Id == id && !s.IsDeleted)
                .ExecuteUpdateAsync(setters => setters.SetProperty(s => s.Name, requestDto.Name));
        }
        catch (Exception exception)
        {
            CoreException? convertedException = ConvertException(exception);
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
            int deletedRecordCount = await _context.Seatings
                .Where(s => s.Id == id && !s.IsDeleted)
                .ExecuteUpdateAsync(setters => setters.SetProperty(s => s.IsDeleted, true));
        }
        catch (Exception exception)
        {
            CoreException? convertedException = ConvertException(exception);
            if (convertedException is null)
            {
                throw;
            }

            throw convertedException;
        }
    }
    #endregion

    #region PrivateMethods
    private CoreException? ConvertException(Exception? exception)
    {
        if (exception is null)
        {
            return null;
        }

        DbExceptionHandledResult? handledResult = _dbExceptionHandler.Handle(exception);
        if (handledResult is null)
        {
            return null;
        }

        if (handledResult.IsConcurrencyConflict)
        {
            return new ConcurrencyException();
        }

        bool isUniquenessViolation = handledResult.IsUniqueConstraintViolation;
        if (isUniquenessViolation && handledResult.ViolatedPropertyName is nameof(Seating.Name))
        {
            return OperationException.Duplicated(
                new object[] { nameof(SeatingUpsertRequestDto.Name) },
                DisplayNames.Name);
        }

        return null;
    }
    #endregion
}
