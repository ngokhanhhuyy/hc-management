namespace HCManagement.Core.Features.Reports;

public interface IReportService
{
    #region Methods
    Task<ReportFigureResponseDto<long>> GetRevenueByPeriodAsync(ReportFigureRequestDto requestDto);
    Task<ReportFigureResponseDto<int>> GetTurnoverCountByPeriodAsync(ReportFigureRequestDto requestDto);
    #endregion
}
