using HCManagement.Core.Common.Dtos;

namespace HCManagement.Core.Features.Reports;

public class ReportFigureResponseDto<TValue> : IResponseDto where TValue : struct
{
    #region Constructors
    public ReportFigureResponseDto(TValue currentPeriodFigure, TValue lastPeriodFigure, int? ratioComparedToLastPeriod)
    {
        CurrentPeriodFigure = currentPeriodFigure;
        LastPeriodFigure = lastPeriodFigure;
        RatioPercentageComparedToLastPeriod = ratioComparedToLastPeriod;
    }
    #endregion

    #region Properties
    public TValue CurrentPeriodFigure { get; }
    public TValue LastPeriodFigure { get; }
    public int? RatioPercentageComparedToLastPeriod { get; }
    #endregion
}
