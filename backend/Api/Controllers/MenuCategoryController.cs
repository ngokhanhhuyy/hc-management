using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HCManagement.Core.Features.MenuCategories;

namespace HCManagement.Api.Controllers;

[ApiController]
[Route("api/menu-categories")]
[Authorize]
public class MenuCategoryController : ControllerBase
{
    #region Fields
    private readonly IMenuCategoryService _service;
    #endregion

    #region Constructors
    public MenuCategoryController(IMenuCategoryService service)
    {
        _service = service;
    }
    #endregion

    #region Methods
    [HttpGet]
    [ProducesResponseType<List<MenuCategoryBasicResponseDto>>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType<MenuCategoryBasicResponseDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetSingle([FromRoute] int id)
    {
        return Ok(await _service.GetSingleAsync(id));
    }

    [HttpPost]
    [ProducesResponseType<int>(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> Create([FromBody] MenuCategoryUpsertRequestDto requestDto)
    {
        int id = await _service.CreateAsync(requestDto);
        return CreatedAtAction(nameof(GetSingle), new { id }, id);
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> Update([FromRoute] int id, [FromBody] MenuCategoryUpsertRequestDto requestDto)
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
 