import { type Context } from "hono";
import { BaseController, route, httpGet, httpPost, fromParam, producesResponseType, authorized, fromJson } from "#/mvc";
import type { IUserService } from "#/services/features/userService.js";
import type { IUserApi, ApiActionIdParamArgs, ApiActionJsonArgs, JsonResponse } from "@hc-management/shared/api";
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
  @fromParam("id", v => v.toNumber())
  @producesResponseType<UserDetailResponseDto>(200)
  @producesResponseType(404)
  public async getDetailAsync(args: ApiActionIdParamArgs<number>): Promise<JsonResponse<UserDetailResponseDto>> {
    const id = args.params.id;
    const responseDto = await this.userService.getDetailByIdAsync(id);
    return this.ok(responseDto);
  }

  @httpPost("/")
  @fromJson(UserCreateRequestDto)
  @producesResponseType<number>(201)
  @producesResponseType<number>(400)
  @producesResponseType<number>(422)
  public async createAsync(args: ApiActionJsonArgs<UserCreateRequestDto>): Promise<JsonResponse<number>> {
    const createdUserId = await this.userService.createAsync(args.json);
    return this.created(`/api/users/${createdUserId}`, createdUserId);
  }
}
