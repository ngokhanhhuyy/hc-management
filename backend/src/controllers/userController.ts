import { type Context } from "hono";
import {
  BaseController,
  route,
  httpGet,
  httpPost,
  fromRoute,
  producesResponseType,
  authorized,
  fromBody
} from "#/mvc";
import type { IUserService } from "#/services/features/userService.js";
import type { IUserApi } from "@hc-management/shared/api";
import { UserCreateRequestDto, type UserDetailResponseDto } from "@hc-management/shared/dtos";

@route("/api/users")
@authorized
export class UserController extends BaseController implements IUserApi {
  private readonly userService: IUserService;

  public constructor(httpContext: Context) {
    super(httpContext);
    this.userService = this.serviceProvider.getRequiredService("userService");
  }

  @httpGet("/:id{[0-9]+}")
  @fromRoute(0, "id", v => v.toNumber())
  @producesResponseType<UserDetailResponseDto>(200)
  @producesResponseType(404)
  public async getDetailAsync(id: number): Promise<UserDetailResponseDto> {
    const responseDto = await this.userService.getDetailByIdAsync(id);
    return this.ok(responseDto);
  }

  @httpPost("/")
  @fromBody(0, UserCreateRequestDto)
  @producesResponseType<number>(201)
  @producesResponseType<number>(400)
  @producesResponseType<number>(422)
  public async createAsync(requestDto: UserCreateRequestDto): Promise<number> {
    const createdUserId = await this.userService.createAsync(requestDto);
    return this.created(`/api/users/${createdUserId}`, createdUserId);
  }
}
