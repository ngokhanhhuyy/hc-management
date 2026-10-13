using HCManagement.Core.Common.Dtos;

namespace HCManagement.Core.Features.Reports;

public class ReportFigureRequestDto : IRequestDto
{
    #region Properties
    public ReportFigurePeriod Period { get; set; } = ReportFigurePeriod.Today;
    #endregion

    #region Methods
    public void TransformValues()
    {
        
    }
    #endregion
}
