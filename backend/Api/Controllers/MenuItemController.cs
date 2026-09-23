using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HCManagement.Core.Features.MenuItems;

namespace HCManagement.Api.Controllers;

[ApiController]
[Route("api/menu-items")]
[Authorize]
public class MenuItemController : ControllerBase
{
    #region Fields
    private readonly IMenuItemService _service;
    #endregion

    #region Constructors
    public MenuItemController(IMenuItemService service)
    {
        _service = service;
    }
    #endregion

    #region Methods
    [HttpPost("list")]
    [ProducesResponseType<List<MenuItemBasicResponseDto>>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetListAsync([FromBody] MenuItemListRequestDto requestDto)
    {
        return Ok(await _service.GetListAsync(requestDto));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType<MenuItemDetailResponseDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetDetailAsync([FromRoute] int id)
    {
        return Ok(await _service.GetDetailAsync(id));
    }

    [HttpPost]
    [ProducesResponseType<int>(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> CreateAsync([FromBody] MenuItemUpsertRequestDto requestDto)
    {
        int id = await _service.CreateAsync(requestDto);
        return CreatedAtAction(nameof(GetDetailAsync), new { id }, id);
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> UpdateAsync([FromRoute] int id, [FromBody] MenuItemUpsertRequestDto requestDto)
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
    public async Task<IActionResult> DeleteAsync([FromRoute] int id)
    {
        await _service.DeleteAsync(id);
        return Ok();
    }

    [HttpGet("default-list-parameters")]
    [ProducesResponseType<MenuItemListRequestDto>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDefaultListParamtersAsync()
    {
        await Task.CompletedTask;
        return Ok(new MenuItemListRequestDto());
    }
    #endregion
}
 