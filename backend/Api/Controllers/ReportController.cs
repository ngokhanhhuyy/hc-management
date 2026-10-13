using HCManagement.Core.Features.Reports;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HCManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
[Authorize]
public class ReportController : ControllerBase
{
    #region Fields
    private readonly IReportService _service;
    #endregion

    #region Constructors
    public ReportController(IReportService service)
    {
        _service = service;
    }
    #endregion

    #region Methods
    [HttpGet]
    [ProducesResponseType<ReportFigureResponseDto<long>>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetRevenueByPeriod([FromQuery] ReportFigureRequestDto requestDto)
    {
        return Ok(await _service.GetRevenueByPeriodAsync(requestDto));
    }

    [HttpGet]
    [ProducesResponseType<ReportFigureResponseDto<int>>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetTurnoverCountByPeriodAsync([FromQuery] ReportFigureRequestDto requestDto)
    {
        return Ok(await _service.GetTurnoverCountByPeriodAsync(requestDto));
    }
    #endregion
}
 