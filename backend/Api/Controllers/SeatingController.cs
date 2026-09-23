using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HCManagement.Core.Features.Seatings;

namespace HCManagement.Api.Controllers;

[ApiController]
[Route("api/seatings")]
[Authorize]
public class SeatingController : ControllerBase
{
    #region Fields
    private readonly ISeatingService _service;
    #endregion

    #region Constructors
    public SeatingController(ISeatingService service)
    {
        _service = service;
    }
    #endregion

    #region Methods
    [HttpGet]
    [ProducesResponseType<List<SeatingBasicResponseDto>>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType<SeatingDetailResponseDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetDetail([FromRoute] int id)
    {
        return Ok(await _service.GetDetailAsync(id));
    }

    [HttpPost]
    [ProducesResponseType<int>(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> CreateAsync([FromBody] SeatingUpsertRequestDto requestDto)
    {
        int id = await _service.CreateAsync(requestDto);
        return CreatedAtAction(nameof(GetDetail), new { id }, id);
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> Update([FromRoute] int id, [FromBody] SeatingUpsertRequestDto requestDto)
    {
        await _service.UpdateAsync(id, requestDto);
        return Ok();
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        await _service.DeleteAsync(id);
        return Ok();
    }
    #endregion
}
 