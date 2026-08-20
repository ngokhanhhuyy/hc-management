import { Hono, type Context } from "hono";
import { generateCookie, setCookie } from "hono/cookie";
import { SignJWT } from "jose";
import { BaseController, type EmptyResult } from "./baseController";
import type { IServiceContainer } from "#/dependencyInjection";
import type { IAuthenticationService } from "#/services/authenticationService";
import type { IUserService } from "#/services/userService";
import {
  AuthenticationVerifyUserNameAndPasswordRequestDto,
  AuthenticationChangePasswordRequestDto
} from "@hc-management/shared/dtos";

export class AuthenticationController extends BaseController {
  private readonly authenticationService: IAuthenticationService;
  private readonly userService: IUserService;

  public constructor({ httpContext }: IServiceContainer) {
    super(httpContext);

    this.authenticationService = this.getRequiredService("authenticationService");
    this.userService = this.getRequiredService("userService");
  }

  public async signInAsync(requestDto: AuthenticationVerifyUserNameAndPasswordRequestDto): Promise<EmptyResult> {
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

  public async changePasswordAsync(requestDto: AuthenticationChangePasswordRequestDto): Promise<EmptyResult> {
    await this.authenticationService.changePasswordAsync(requestDto);
    return this.ok();
  }

  public static getInstance(context: Context): AuthenticationController {
    return context.get("provider").getRequiredService("authenticationController");
  }
}

export const authenticationApi = new Hono()
  .post(
    "/get-access-cookie",
    AuthenticationController.validateJson(AuthenticationVerifyUserNameAndPasswordRequestDto),
    (context => AuthenticationController.getInstance(context).signInAsync(context.req.valid("json"))))
  .post(
    "/change-password",
    AuthenticationController.validateJson(AuthenticationChangePasswordRequestDto),
    (context => AuthenticationController.getInstance(context).changePasswordAsync(context.req.valid("json"))));
