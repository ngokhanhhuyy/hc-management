import { Hono, type Context } from "hono";
import { BaseController, type JsonResult } from "./baseController";
import type { IServiceContainer } from "#/dependencyInjection";
import type { IUserService } from "#/services/userService";
import { UserDetailResponseDto } from "@hc-management/shared/dtos";

export class UserController extends BaseController {
  private readonly userService: IUserService;

  public constructor({ httpContext }: IServiceContainer) {
    super(httpContext);
    this.userService = this.getRequiredService("userService");
  }

  public async getDetailAsync(id: number): Promise<JsonResult<UserDetailResponseDto>> {
    const responseDto = await this.userService.getDetailByIdAsync(id);
    return this.ok(responseDto);
  }

  public static getInstance(context: Context): UserController {
    return context.get("provider").getRequiredService("userController");
  }
}

export const userApi = new Hono()
  .get(
    "/:id{[0-9]+}",
    (context => UserController.getInstance(context).getDetailAsync(parseInt(context.req.param("id")))));
