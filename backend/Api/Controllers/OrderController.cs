using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HCManagement.Core.Features.Orders;

namespace HCManagement.Api.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize]
public class OrderController : ControllerBase
{
    #region Fields
    private readonly IOrderService _service;
    #endregion

    #region Constructors
    public OrderController(IOrderService service)
    {
        _service = service;
    }
    #endregion

    #region Methods
    [HttpPost("list")]
    [ProducesResponseType<OrderListResponseDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetList([FromBody] OrderListRequestDto requestDto)
    {
        return Ok(await _service.GetListAsync(requestDto));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType<OrderDetailResponseDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetDetail([FromRoute] int id)
    {
        return Ok(await _service.GetDetailAsync(id));
    }

    [HttpPost]
    [ProducesResponseType<OrderDetailResponseDto>(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> Create([FromBody] OrderUpsertRequestDto requestDto)
    {
        OrderDetailResponseDto responseDto = await _service.CreateAsync(requestDto);
        string createdUrl = Url.Action(nameof(GetDetail), nameof(OrderController), new { id = responseDto.Id }) ?? "";
        return Created(createdUrl, responseDto);
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType<OrderDetailResponseDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> Update([FromRoute] int id, [FromBody] OrderUpsertRequestDto requestDto)
    {
        return Ok(await _service.UpdateAsync(id, requestDto));
    }

    [HttpPut("{id:int}/finish")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> Finish([FromRoute] int id)
    {
        await _service.FinishAsync(id);
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

    [HttpGet("default-list-parameters")]
    [ProducesResponseType<OrderListRequestDto>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDefaultListParameters()
    {
        await Task.CompletedTask;
        return Ok(new OrderListRequestDto());
    }
    #endregion
}
 