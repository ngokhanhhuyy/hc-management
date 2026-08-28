import { Context } from "hono";
import { setCookie, deleteCookie } from "hono/cookie";
import { SignJWT } from "jose";
import { BaseController } from "#/framework/mvc/baseController";
import { controller, route, httpGet, httpPost, fromBody, producesResponseType, authorize } from "#/framework/mvc";
import type { IAuthenticationService } from "#/core/services/authenticationService";
import type { IUserService } from "#/core/services/userService";
import type { IAuthenticationApi } from "@hc-management/shared/api";
import {
  AuthenticationVerifyUserNameAndPasswordRequestDto as GetAccessCookieRequestDto,
  AuthenticationChangePasswordRequestDto as ChangePasswordRequestDto
} from "@hc-management/shared/dtos";

@controller
@route("/api/authentication")
export class AuthenticationController extends BaseController implements IAuthenticationApi {
  private readonly authenticationService: IAuthenticationService;
  private readonly userService: IUserService;

  public constructor(httpContext: Context) {
    super(httpContext);
    this.authenticationService = this.serviceProvider.getRequiredService("authenticationService");
    this.userService = this.serviceProvider.getRequiredService("userService");
  }

  @httpPost("/get-access-cookie")
  @fromBody(0, GetAccessCookieRequestDto)
  @producesResponseType(200)
  @producesResponseType(400)
  @producesResponseType(401)
  @producesResponseType(403)
  @producesResponseType(422)
  public async getAccessCookieAsync(requestDto: GetAccessCookieRequestDto): Promise<void> {
    await this.authenticationService.verifyUserNameAndPasswordAsync(requestDto);
    const secretKey = new TextEncoder().encode(process.env.SECRET_KEY!);
    const userDetailResonseDto = await this.userService.getDetailByUserNameAsync(requestDto.userName);
    const token = await new SignJWT(userDetailResonseDto)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(secretKey);

    setCookie(this.httpContext, "Authorization", `Bearer ${token}`, {
      path: "/",
      secure: true,
      httpOnly: true,
    });

    return this.ok();
  }

  @httpPost("/clear-access-cookie")
  @authorize
  @producesResponseType(200)
  @producesResponseType(401)
  public async clearAccessCookieAsync(): Promise<void> {
    deleteCookie(this.httpContext, "Authorization");
    return this.ok();
  }

  @httpGet("/check-status")
  @authorize
  @producesResponseType(200)
  @producesResponseType(401)
  public async checkStatusAsync(): Promise<void> {
    return this.ok();
  }


  @httpPost("/change-password")
  @authorize
  @fromBody(0, ChangePasswordRequestDto)
  @producesResponseType(200)
  @producesResponseType(400)
  @producesResponseType(401)
  @producesResponseType(403)
  @producesResponseType(422)
  public async changePasswordAsync(requestDto: ChangePasswordRequestDto): Promise<void> {
    await this.authenticationService.changePasswordAsync(requestDto);
    return this.ok();
  }
}
