using FluentValidation;
using HCManagement.Core.Common.Exceptions;
using HCManagement.Core.Common.Extensions;
using HCManagement.Core.Common.Localization;
using HCManagement.Core.Common.Security;
using HCManagement.Core.Common.Time;
using HCManagement.Core.Persistence.DbContext;
using HCManagement.Core.Persistence.Handlers;
using Microsoft.EntityFrameworkCore;

namespace HCManagement.Core.Features.MenuItems;

internal class MenuItemService : IMenuItemService
{
    #region Fields
    private readonly AppDbContext _context;
    private readonly IValidator<MenuItemListRequestDto> _listValidator;
    private readonly IValidator<MenuItemUpsertRequestDto> _upsertValidator;
    private readonly IDbExceptionHandler _dbExceptionHandler;
    private readonly ICallerDetailProvider _callerDetailProvider;
    private readonly IClock _clock;
    #endregion

    #region Constructors
    public MenuItemService(
        AppDbContext context,
        IValidator<MenuItemListRequestDto> listValidator,
        IValidator<MenuItemUpsertRequestDto> upsertValidator,
        IDbExceptionHandler dbExceptionHandler,
        ICallerDetailProvider callerDetailProvider,
        IClock clock)
    {
        _context = context;
        _listValidator = listValidator;
        _upsertValidator = upsertValidator;
        _dbExceptionHandler = dbExceptionHandler;
        _callerDetailProvider = callerDetailProvider;
        _clock = clock;
    }
    #endregion
    
    #region Methods
    public async Task<List<MenuItemBasicResponseDto>> GetListAsync(MenuItemListRequestDto requestDto)
    {
        _listValidator.ValidateAndThrow(requestDto);

        IQueryable<MenuItem> query = _context.MenuItems;

        switch (requestDto.SortByCriterion)
        {
            case MenuItemListSortingCriterion.Name:
                query = query
                    .Include(mi => mi.Category)
                    .ApplySorting(mi => mi.Name, requestDto.SortByAscending)
                    .ThenApplySorting(mi => mi.Category == null ? null : mi.Category.Name, requestDto.SortByAscending);
                break;
            case MenuItemListSortingCriterion.Category:
                query = query
                    .Include(mi => mi.Category)
                    .ApplySorting(mi => mi.Category == null ? null : mi.Category.Name, requestDto.SortByAscending)
                    .ThenApplySorting(mi => mi.Name, requestDto.SortByAscending);
                break;
            case MenuItemListSortingCriterion.DefaultAmountBeforeVatPerUnit:
                query = query
                    .ApplySorting(mi => mi.DefaultAmountBeforeVatPerUnit, requestDto.SortByAscending)
                    .ThenApplySorting(mi => mi.Name, requestDto.SortByAscending);
                break;
            default:
                throw new NotImplementedException();
        }

        if (requestDto.SearchContent is not null && requestDto.SearchContent.Length > 0)
        {
            string searchContent = requestDto.SearchContent.ToLower().ToNonDiacritics();
            query = query.Where(mi => mi.NormalizedName.Contains(searchContent));
        }

        if (requestDto.CategoryId.HasValue)
        {
            query = query.Where(mi => mi.CategoryId == requestDto.CategoryId.Value);
        }

        if (!requestDto.DeletedIncluded)
        {
            query = query.Where(mi => mi.DeletedDateTime == null);
        }

        return await query
            .Select(mi => new MenuItemBasicResponseDto(mi))
            .ToListAsync();
    }

    public async Task<MenuItemDetailResponseDto> GetDetailAsync(int id)
    {
        return await _context.MenuItems
            .Include(mi => mi.CreatedUser)
            .Include(mi => mi.LastUpdatedUser)
            .Include(mi => mi.DeletedUser)
            .Select(mi => new MenuItemDetailResponseDto(mi))
            .SingleOrDefaultAsync(mi => mi.Id == id)
            ?? throw new NotFoundException();
    }

    public async Task<int> CreateAsync(MenuItemUpsertRequestDto requestDto)
    {
        _upsertValidator.ValidateAndThrow(requestDto);

        MenuItem menuItem = new()
        {
            Name = requestDto.Name,
            Unit = requestDto.Unit,
            DefaultAmountBeforeVatPerUnit = requestDto.DefaultAmountBeforeVatPerUnit,
            DefaultVatPercentagePerUnit = requestDto.DefaultVatPercentagePerUnit,
            CategoryId = requestDto.CategoryId,
            CreatedUserId = _callerDetailProvider.GetId(),
            CreatedDateTime = _clock.Now,
        };

        _context.MenuItems.Add(menuItem);

        try
        {
            await _context.SaveChangesAsync();
            return menuItem.Id;
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

    public async Task UpdateAsync(int id, MenuItemUpsertRequestDto requestDto)
    {
        _upsertValidator.ValidateAndThrow(requestDto);

        try
        {
            int updatedRecordCount = await _context.MenuItems
                .Where(mi => mi.Id == id && mi.DeletedDateTime == null)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(mi => mi.Name, requestDto.Name)
                    .SetProperty(mi => mi.Unit, requestDto.Unit)
                    .SetProperty(mi => mi.DefaultAmountBeforeVatPerUnit, requestDto.DefaultAmountBeforeVatPerUnit)
                    .SetProperty(mi => mi.DefaultVatPercentagePerUnit, requestDto.DefaultVatPercentagePerUnit)
                    .SetProperty(mi => mi.LastUpdatedUserId, _callerDetailProvider.GetId())
                    .SetProperty(mi => mi.LastUpdatedDateTime, _clock.Now));

            if (updatedRecordCount == 0)
            {
                throw new NotFoundException();
            }
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
            int deletedRecordCount = await _context.MenuItems
                .Where(mi => mi.Id == id && mi.DeletedDateTime == null)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(mi => mi.DeletedUserId, _callerDetailProvider.GetId())
                    .SetProperty(mi => mi.DeletedDateTime, _clock.Now));

            if (deletedRecordCount == 0)
            {
                throw new NotFoundException();
            }
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

        bool isUniquenessViolation = handledResult.IsUniqueConstraintViolation;
        if (isUniquenessViolation && handledResult.ViolatedPropertyName is nameof(MenuItem.Name))
        {
            throw OperationException.Duplicated(
                new object[] { nameof(MenuItemUpsertRequestDto.Name) },
                DisplayNames.Name);
        }

        bool isForeignKeyViolation = handledResult.IsForeignKeyConstraintViolation;
        if (isForeignKeyViolation && handledResult.ViolatedPropertyName is nameof(MenuItem.CategoryId))
        {
            return OperationException.NotFound(
                new object[] { nameof(MenuItemUpsertRequestDto.CategoryId) },
                DisplayNames.Category);
        }

        return null;
    }
    #endregion
}
