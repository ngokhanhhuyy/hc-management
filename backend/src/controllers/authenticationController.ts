import { type Context } from "hono";
import { setCookie, deleteCookie } from "hono/cookie";
import { SignJWT } from "jose";
import { BaseController } from "#/mvc/baseController";
import { route, httpPost, fromJson, producesResponseType, authorized } from "#/mvc";
import type { IAuthenticationService } from "#/services/features/authenticationService.js";
import type { IUserService } from "#/services/features/userService.js";
import type { IAuthenticationApi, ApiActionJsonArgs, EmptyResponse } from "@hc-management/shared/api";
import {
  AuthenticationVerifyUserNameAndPasswordRequestDto as GetAccessCookieRequestDto,
  AuthenticationChangePasswordRequestDto as ChangePasswordRequestDto
} from "@hc-management/shared/dtos";

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
  @fromJson(GetAccessCookieRequestDto)
  @producesResponseType(200)
  @producesResponseType(400)
  @producesResponseType(401)
  @producesResponseType(403)
  @producesResponseType(422)
  public async getAccessCookieAsync(args: ApiActionJsonArgs<GetAccessCookieRequestDto>): Promise<EmptyResponse> {
    await this.authenticationService.verifyUserNameAndPasswordAsync(args.json);
    const secretKey = new TextEncoder().encode(process.env.SECRET_KEY!);
    const userDetailResonseDto = await this.userService.getDetailByUserNameAsync(args.json.userName);
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
  @authorized
  @producesResponseType(200)
  @producesResponseType(401)
  public async clearAccessCookieAsync(): Promise<EmptyResponse> {
    deleteCookie(this.httpContext, "Authorization");
    return this.ok();
  }


  @httpPost("/change-password")
  @authorized
  @fromJson(ChangePasswordRequestDto)
  @producesResponseType(200)
  @producesResponseType(400)
  @producesResponseType(401)
  @producesResponseType(403)
  @producesResponseType(422)
  public async changePasswordAsync(args: ApiActionJsonArgs<ChangePasswordRequestDto>): Promise<EmptyResponse> {
    await this.authenticationService.changePasswordAsync(args.json);
    return this.ok();
  }
}
