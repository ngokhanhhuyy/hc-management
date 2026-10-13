using FluentValidation;
using HCManagement.Core.Common.Time;
using HCManagement.Core.Features.Orders;
using HCManagement.Core.Persistence.DbContext;
using Microsoft.EntityFrameworkCore;
using System.Numerics;

namespace HCManagement.Core.Features.Reports;

internal class ReportService : IReportService
{
    #region Fields
    private readonly IDbContextFactory<AppDbContext> _contextFactory;
    private readonly IValidator<ReportFigureRequestDto> _validator;
    private readonly IClock _clock;
    #endregion

    #region Constructors
    public ReportService(
        IDbContextFactory<AppDbContext> context,
        IValidator<ReportFigureRequestDto> validator,
        IClock clock)
    {
        _contextFactory = context;
        _validator = validator;
        _clock = clock;
    }
    #endregion

    #region Methods
    public async Task<ReportFigureResponseDto<long>> GetRevenueByPeriodAsync(ReportFigureRequestDto requestDto)
    {
        return await GetReportFigureByPeriodAsync(requestDto, query => query.SumAsync(o => o.CachedItemAmount));
    }

    public async Task<ReportFigureResponseDto<int>> GetTurnoverCountByPeriodAsync(ReportFigureRequestDto requestDto)
    {
        return await GetReportFigureByPeriodAsync(requestDto, query => query.CountAsync());
    }
    #endregion

    #region PrivateMethods
    private async Task<ReportFigureResponseDto<TValue>> GetReportFigureByPeriodAsync<TValue>(
        ReportFigureRequestDto requestDto,
        Func<IQueryable<Order>, Task<TValue>> getFigureAsync) where TValue : struct
    {
        DateOnly currentPeriodEndingDate = _clock.Today;
        int dayDifference;
        switch (requestDto.Period)
        {
            case ReportFigurePeriod.Today:
                dayDifference = 1;
                break;

            case ReportFigurePeriod.Last7Days:
                dayDifference = 7;
                break;

            case ReportFigurePeriod.Last2Weeks:
                dayDifference = 14;
                break;

            case ReportFigurePeriod.LastMonth:
                dayDifference = 25;
                break;

            case ReportFigurePeriod.LastYear:
                dayDifference = 365;
                break;

            default:
                throw new NotImplementedException();
        }
        
        DateOnly currentPeriodStartingDate = currentPeriodEndingDate.AddDays(-dayDifference);
        DateOnly lastPeriodEndingDate = currentPeriodStartingDate.AddDays(-1);
        DateOnly lastPeriodStartingDate = lastPeriodEndingDate.AddDays(-dayDifference);

        Task<TValue> currentPeriodFigureTask = getFigureAsync(GetOrderQueryByPeriod(
            currentPeriodStartingDate,
            currentPeriodEndingDate));

        Task<TValue> lastPeriodFigureTask = getFigureAsync(GetOrderQueryByPeriod(
            lastPeriodStartingDate,
            lastPeriodEndingDate));

        await Task.WhenAll(currentPeriodFigureTask, lastPeriodFigureTask);

        int? ratioBetweenPeriods = GetRatioBetweenPeriods(currentPeriodFigureTask.Result, lastPeriodFigureTask.Result);

        return new(
            currentPeriodFigure: currentPeriodFigureTask.Result,
            lastPeriodFigure: lastPeriodFigureTask.Result,
            ratioComparedToLastPeriod: ratioBetweenPeriods);
    }

    private IQueryable<Order> GetOrderQueryByPeriod(DateOnly startingDate, DateOnly endingDate)
    {
        AppDbContext context = _contextFactory.CreateDbContext();
        return context.Orders
            .Where(o =>
                o.FinishedDateTime.HasValue &&
                DateOnly.FromDateTime(o.FinishedDateTime.Value) >= startingDate &&
                DateOnly.FromDateTime(o.FinishedDateTime.Value) <= endingDate);
    }
    #endregion

    #region PrivateStaticMethods
    private static int? GetRatioBetweenPeriods<TValue>(
        TValue currentPeriodFigure,
        TValue lastPeriodFigure) where TValue : struct
    {
        if (currentPeriodFigure is long longCurrentPeriodFigure && lastPeriodFigure is long longLastPeriodFigure)
        {
            if (longLastPeriodFigure == 0)
            {
                return null;
            }

            return 100 - (int)((decimal)longCurrentPeriodFigure / longLastPeriodFigure * 100);
        }

        if (currentPeriodFigure is int intCurrentPeriodFigure && lastPeriodFigure is int intLastPeriodFigure)
        {
            if (intLastPeriodFigure == 0)
            {
                return null;
            }

            return 100 - (int)((decimal)intCurrentPeriodFigure / intLastPeriodFigure * 100);
        }

        throw new InvalidDataException($"Only \"int\" or \"long\" is accepted.");
    }
    #endregion
}
