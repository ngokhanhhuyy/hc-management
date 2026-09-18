using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HCManagement.Core.Common.Security;
using HCManagement.Core.Features.Authentication;
using HCManagement.Core.Features.Users;
using IAuthenticationService = HCManagement.Core.Features.Authentication.IAuthenticationService;

namespace HCManagement.Api.Controllers;

[Route("api/[controller]/[action]")]
[ApiController]
public class AuthenticationController : ControllerBase
{
    #region Fields
    private readonly ICallerDetailProvider _callerDetailProvider;
    private readonly IAuthenticationService _authenticationService;
    private readonly IUserService _userService;
    #endregion

    #region Constructors
    public AuthenticationController(
        ICallerDetailProvider callerDetailProvider,
        IAuthenticationService authenticationService,
        IUserService userService)
    {
        _callerDetailProvider = callerDetailProvider;
        _authenticationService = authenticationService;
        _userService = userService;
    }
    #endregion

    #region Methods
    [AllowAnonymous]
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> GetAccessCookie([FromBody] VerifyCredentialsRequestDto requestDto)
    {
        await _authenticationService.VerifyCredentialsAsync(requestDto);
        UserDetailResponseDto  userResponseDto;
        userResponseDto = await _userService.GetDetailByUserNameAsync(requestDto.UserName);

        List<Claim> claims = new()
        {
            new(ClaimTypes.NameIdentifier, userResponseDto.Id.ToString()),
            new(ClaimTypes.Name, userResponseDto.UserName),
        };

        ClaimsIdentity claimsIdentity = new(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        ClaimsPrincipal claimsPrincipal = new(claimsIdentity);

        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            claimsPrincipal,
            new()
            {
                IsPersistent = true,
                ExpiresUtc = DateTimeOffset.UtcNow.AddDays(7)
            });

        return Ok();
    }

    [Authorize]
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> ClearAccessCookieAsync()
    {
        await HttpContext.SignOutAsync();
        return Ok();
    }

    [Authorize]
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> CallerDetail()
    {
        return Ok(await _userService.GetDetailByIdAsync(_callerDetailProvider.GetId()));
    }

    [Authorize]
    [HttpPut]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestDto requestDto)
    {
        await _authenticationService.ChangePasswordAsync(requestDto);
        return Ok();
    }

    [Authorize]
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult CheckAuthenticationStatus()
    {
        return Ok();
    }
    #endregion
}
