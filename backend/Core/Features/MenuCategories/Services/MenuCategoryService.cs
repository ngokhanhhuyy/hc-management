using FluentValidation;
using HCManagement.Core.Common.Exceptions;
using HCManagement.Core.Common.Localization;
using HCManagement.Core.Persistence.DbContext;
using HCManagement.Core.Persistence.Handlers;
using Microsoft.EntityFrameworkCore;
using System.Data.Common;

namespace HCManagement.Core.Features.MenuCategories;

internal class MenuCategoryService : IMenuCategoryService
{
    #region Fields
    private readonly AppDbContext _context;
    private readonly IValidator<MenuCategoryUpsertRequestDto> _upsertValidator;
    private readonly IDbExceptionHandler _dbExceptionHandler;
    #endregion

    #region Constructors
    public MenuCategoryService(
        AppDbContext context,
        IValidator<MenuCategoryUpsertRequestDto> upsertValidator,
        IDbExceptionHandler dbExceptionHandler)
    {
        _context = context;
        _upsertValidator = upsertValidator;
        _dbExceptionHandler = dbExceptionHandler;
    }
    #endregion

    #region Methods
    public async Task<List<MenuCategoryBasicResponseDto>> GetAllAsync()
    {
        return await _context.MenuCategories
            .OrderBy(mc => mc.Name)
            .Select(mc => new MenuCategoryBasicResponseDto(mc))
            .ToListAsync();
    }

    public async Task<MenuCategoryBasicResponseDto> GetSingleAsync(int id)
    {
        return await _context.MenuCategories
            .Where(mc => mc.Id == id)
            .Select(mc => new MenuCategoryBasicResponseDto(mc))
            .SingleOrDefaultAsync()
            ?? throw new NotFoundException();
    }

    public async Task<int> CreateAsync(MenuCategoryUpsertRequestDto requestDto)
    {
        requestDto.TransformValues();
        _upsertValidator.ValidateAndThrow(requestDto);

        MenuCategory menuCategory = new()
        {
            Name = requestDto.Name
        };

        _context.MenuCategories.Add(menuCategory);

        try
        {
            await _context.SaveChangesAsync();
            return menuCategory.Id;
        }
        catch (DbUpdateException exception)
        {
            CoreException? convertedException = ConvertException(exception);
            if (convertedException is null)
            {
                throw;
            }
            
            throw convertedException;
        }
    }

    public async Task UpdateAsync(int id, MenuCategoryUpsertRequestDto requestDto)
    {
        requestDto.TransformValues();
        _upsertValidator.ValidateAndThrow(requestDto);

        try
        {
            int updatedRecordCount = await _context.MenuCategories
                .Where(mc => mc.Id == id)
                .ExecuteUpdateAsync(setters => setters.SetProperty(mc => mc.Name, requestDto.Name));

            if (updatedRecordCount == 0)
            {
                throw new NotFoundException();
            }
        }
        catch (DbException exception)
        {
            CoreException? convertedException = ConvertException(exception);
            if (convertedException is not null)
            {
                throw convertedException;
            }

            throw;
        }
    }

    public async Task DeleteAsync(int id)
    {
        try
        {
            int deletedRecordCount = await _context.MenuCategories
                .Where(mc => mc.Id == id)
                .ExecuteDeleteAsync();

            if (deletedRecordCount == 0)
            {
                throw new NotFoundException();
            }
        }
        catch (DbException exception)
        {
            CoreException? convertedException = ConvertException(exception);
            if (convertedException is not null)
            {
                throw convertedException;
            }

            throw;
        }
    }
    #endregion

    #region PrivateMethods
    private CoreException? ConvertException(Exception exception)
    {
        DbExceptionHandledResult? handledResult = _dbExceptionHandler.Handle(exception);
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
                new object[] { nameof(MenuCategoryUpsertRequestDto.Name) },
                DisplayNames.Name);
        }

        return null;
    }
    #endregion
}
