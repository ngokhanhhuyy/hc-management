using FluentValidation;
using HCManagement.Core.Common.Exceptions;
using HCManagement.Core.Common.Extensions;
using HCManagement.Core.Common.Localization;
using HCManagement.Core.Common.Security;
using HCManagement.Core.Common.Services;
using HCManagement.Core.Common.Time;
using HCManagement.Core.Features.Seatings;
using HCManagement.Core.Persistence.DbContext;
using HCManagement.Core.Persistence.Handlers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace HCManagement.Core.Features.Orders;

internal class OrderService : IOrderService
{
    #region Fields
    private readonly AppDbContext _context;
    private readonly IListFetchingService _listFetchingService;
    private readonly IValidator<OrderListRequestDto> _listValidator;
    private readonly IValidator<OrderUpsertRequestDto> _upsertValidator;
    private readonly IDbExceptionHandler _dbExceptionHandler;
    private readonly ICallerDetailProvider _callerDetailProvider;
    private readonly IClock _clock;
    #endregion

    #region Constructors
    public OrderService(
        AppDbContext context,
        IListFetchingService listFetchingService,
        IValidator<OrderListRequestDto> listValidator,
        IValidator<OrderUpsertRequestDto> upsertValidator,
        IDbExceptionHandler dbExceptionHandler,
        ICallerDetailProvider callerDetailProvider,
        IClock clock)
    {
        _context = context;
        _listFetchingService = listFetchingService;
        _listValidator = listValidator;
        _upsertValidator = upsertValidator;
        _dbExceptionHandler = dbExceptionHandler;
        _callerDetailProvider = callerDetailProvider;
        _clock = clock;
    }
    #endregion

    #region Methods
    public async Task<OrderListResponseDto> GetListAsync(OrderListRequestDto requestDto)
    {
        _listValidator.ValidateAndThrow(requestDto);

        IQueryable<Order> query = _context.Orders;

        if (!requestDto.DeletedIncluded)
        {
            query = query.Where(o => o.DeletedDateTime == null);
        }

        switch (requestDto.SortByCriterion)
        {
            case OrderListSortingCriterion.CreatedDateTime:
                query = query
                    .ApplySorting(o => o.CreatedDateTime, requestDto.SortByAscending)
                    .ThenApplySorting(o => o.Id, requestDto.SortByAscending);
                break;
            
            case OrderListSortingCriterion.LastUpdatedDateTime:
                query = query
                    .ApplySorting(o => o.LastUpdatedDateTime, requestDto.SortByAscending)
                    .ThenApplySorting(o => o.CreatedDateTime, requestDto.SortByAscending);
                break;

            case OrderListSortingCriterion.FinishedDateTime:
                query = query
                    .ApplySorting(o => o.FinishedDateTime, requestDto.SortByAscending)
                    .ThenApplySorting(o => o.FinishedDateTime, requestDto.SortByAscending);
                break;

            case OrderListSortingCriterion.ItemAmount:
                query = query
                    .ApplySorting(o => o.CachedItemAmount, requestDto.SortByAscending)
                    .ThenApplySorting(o => o.Id, requestDto.SortByAscending);
                break;

            default:
                throw new NotImplementedException();
        }

        Page<OrderBasicResponseDto> page = await _listFetchingService.GetPagedListAsync(
            query.Select(o => new OrderBasicResponseDto(o)),
            requestDto.Page,
            requestDto.ResultsPerPage);

        return new(items: page.Items.ToList(), pageCount: page.PageCount, itemCount: page.ItemCount);
    }

    public async Task<OrderDetailResponseDto> GetDetailAsync(int id)
    {
        return await _context.Orders
            .Include(o => o.CreatedUser)
            .Include(o => o.LastUpdatedUser)
            .Include(o => o.FinishedUser)
            .Include(o => o.DeletedUser)
            .Include(o => o.Seating)
            .Include(o => o.Items).ThenInclude(oi => oi.MenuItem)
            .Where(o => o.Id == id)
            .Select(o => new OrderDetailResponseDto(o))
            .AsSplitQuery()
            .SingleOrDefaultAsync()
            ?? throw new NotFoundException();
    }

    public async Task<OrderDetailResponseDto> CreateAsync(OrderUpsertRequestDto requestDto)
    {
        _upsertValidator.ValidateAndThrow(requestDto);

        Seating seating = await _context.Seatings
            .SingleOrDefaultAsync(s => s.Id == requestDto.SeatingId && !s.IsDeleted)
            ?? throw OperationException.NotFound(
                new object[] { nameof(requestDto.SeatingId) },
                DisplayNames.Seating);

        using IDbContextTransaction transaction = await _context.Database.BeginTransactionAsync();
        int evaluatingOrderItemIndex = -1;
        try
        {
            Order order = new()
            {
                CreatedDateTime = _clock.Now,
                CreatedUserId = _callerDetailProvider.GetId(),
                Seating = seating
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            for (int index = 0; index < requestDto.Items.Count; index += 1)
            {
                evaluatingOrderItemIndex = index;
                OrderItemUpsertRequestDto itemRequestDto = requestDto.Items[index];
                OrderItem orderItem = new()
                {
                    AmountBeforeVatPerUnit = itemRequestDto.AmountBeforeVatPerUnit,
                    VatPercentagePerUnit = itemRequestDto.VatPercentagePerUnit,
                    Quantity = itemRequestDto.Quantity,
                    MenuItemId = itemRequestDto.MenuItemId
                };

                order.Items.Add(orderItem);
                await _context.SaveChangesAsync();
            }
            
            await transaction.CommitAsync();
            return await GetDetailAsync(order.Id);
        }
        catch (Exception exception)
        {
            CoreException? convertedException = ConvertException(exception, evaluatingOrderItemIndex);
            if (convertedException is null)
            {
                throw;
            }

            throw convertedException;
        }
    }

    public async Task<OrderDetailResponseDto> UpdateAsync(int id, OrderUpsertRequestDto requestDto)
    {
        _upsertValidator.ValidateAndThrow(requestDto);

        using IDbContextTransaction transaction = await _context.Database.BeginTransactionAsync();

        Order order = await _context.Orders
            .Include(o => o.Items).ThenInclude(oi => oi.MenuItem)
            .Where(o => o.Id == id && o.DeletedDateTime == null)
            .AsSplitQuery()
            .SingleOrDefaultAsync()
            ?? throw new NotFoundException();

        int evaluatingOrderItemIndex = -1;
        try
        {
            for (int index = 0; index < requestDto.Items.Count; index += 1)
            {
                evaluatingOrderItemIndex = index;
                OrderItemUpsertRequestDto itemRequestDto = requestDto.Items[index];
                OrderItem orderItem;

                if (itemRequestDto.Id is null)
                {
                    orderItem = new()
                    {
                        AmountBeforeVatPerUnit = itemRequestDto.AmountBeforeVatPerUnit,
                        VatPercentagePerUnit = itemRequestDto.VatPercentagePerUnit,
                        Quantity = itemRequestDto.Quantity,
                        MenuItemId = itemRequestDto.MenuItemId
                    };

                    order.Items.Add(orderItem);
                }
                else
                {
                    orderItem = order.Items
                        .SingleOrDefault(oi => oi.Id == itemRequestDto.Id)
                        ?? throw OperationException.NotFound(
                            new object[] { nameof(requestDto.Items), index, nameof(itemRequestDto.Id) },
                            DisplayNames.OrderItem);

                    orderItem.AmountBeforeVatPerUnit = itemRequestDto.AmountBeforeVatPerUnit;
                    orderItem.VatPercentagePerUnit = itemRequestDto.VatPercentagePerUnit;
                    orderItem.Quantity = itemRequestDto.Quantity;
                }

                await _context.SaveChangesAsync();
            }

            order.LastUpdatedDateTime = _clock.Now;
            order.LastUpdatedUserId = _callerDetailProvider.GetId();
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();
            return await GetDetailAsync(id);
        }
        catch (Exception exception)
        {
            CoreException? convertedException = ConvertException(exception, evaluatingOrderItemIndex);
            if (convertedException is null)
            {
                throw;
            }

            throw convertedException;
        }
    }

    public async Task FinishAsync(int id)
    {
        try
        {
            int finishedOrderCount = await _context.Orders
                .Where(o => o.Id == id)
                .Where(o => o.FinishedDateTime == null)
                .Where(o => o.DeletedDateTime == null)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(o => o.FinishedDateTime, _clock.Now));

            if (finishedOrderCount == 0)
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
        Order order = await _context.Orders
            .Where(o => o.Id == id)
            .Where(o => o.DeletedDateTime == null)
            .SingleOrDefaultAsync()
            ?? throw new NotFoundException();

        if (order.FinishedDateTime is not null)
        {
            order.DeletedDateTime = _clock.Now;
            order.DeletedUserId = _callerDetailProvider.GetId();
        }
        else
        {
            _context.Orders.Remove(order);
        }

        try
        {
            await _context.SaveChangesAsync();
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
    private CoreException? ConvertException(Exception exception, int evaluatingOrderItemIndex = -1)
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

        if (handledResult.IsForeignKeyConstraintViolation)
        {
            string? violatedEntityName = handledResult.ViolatedEntityName;
            string? violatedPropertyName = handledResult.ViolatedPropertyName;

            if (violatedEntityName is nameof(Order) && violatedPropertyName is nameof(Order.SeatingId))
            {
                return OperationException.NotFound(
                    new object[] { nameof(OrderUpsertRequestDto.SeatingId) },
                    DisplayNames.Seating
                );
            }

            if (violatedEntityName is nameof(OrderItem) && violatedPropertyName is nameof(OrderItem.MenuItemId))
            {
                return OperationException.NotFound(
                    new object[]
                    {
                        nameof(OrderUpsertRequestDto.Items),
                        evaluatingOrderItemIndex,
                        nameof(OrderItemUpsertRequestDto.MenuItemId)
                    },
                    DisplayNames.MenuItem
                );
            }
        }

        return null;
    }
    #endregion
}
