import { type Context } from "hono";
import { BaseController } from "#/mvc/baseController";
import {
  route,
  httpGet,
  httpPost,
  httpPut,
  httpDelete,
  fromJson,
  producesResponseType,
  authorized,
  fromParam
} from "#/mvc";
import type { IMenuCategoryService } from "#/services/features/menuCategoryService.js";
import type {
  IMenuCategoryApi,
  ApiActionArgs,
  ApiActionIdParamArgs,
  ApiActionJsonArgs,
  JsonResponse,
  EmptyResponse
} from "@hc-management/shared/api";
import {
  MenuCategoryUpsertRequestDto as UpsertRequestDto,
  type MenuCategoryBasicResponseDto as BasicResponseDto
} from "@hc-management/shared/dtos";

@route("/api/menu-categories")
@authorized
export class MenuCategoryController extends BaseController implements IMenuCategoryApi {
  private readonly menuCategoryService: IMenuCategoryService;

  public constructor(httpContext: Context) {
    super(httpContext);
    this.menuCategoryService = this.serviceProvider.getRequiredService("menuCategoryService");
  }

  @httpGet("/")
  @producesResponseType<BasicResponseDto[]>(200)
  public async getAllAsync(): Promise<JsonResponse<BasicResponseDto[]>> {
    return this.ok(await this.menuCategoryService.getAllAsync());
  }

  @httpGet("/:id{[0-9]+}")
  @fromParam("id", (v) => v.toNumber())
  @producesResponseType<BasicResponseDto>(200)
  @producesResponseType(401)
  @producesResponseType(403)
  @producesResponseType(404)
  public async getSingleAsync(args: ApiActionIdParamArgs<number>): Promise<JsonResponse<BasicResponseDto>> {
    return this.ok(await this.menuCategoryService.getSingleAsync(args.params.id));
  }

  @httpPost("/")
  @fromJson(UpsertRequestDto)
  @producesResponseType<number>(201)
  @producesResponseType(400)
  @producesResponseType(401)
  @producesResponseType(403)
  @producesResponseType(422)
  public async createAsync(args: ApiActionJsonArgs<UpsertRequestDto>): Promise<JsonResponse<number>> {
    const createdId = await this.menuCategoryService.createAsync(args.json);
    return this.created(`/api/menu-category/${createdId}`, createdId);
  }

  @httpPut("/:id{[0-9]+}")
  @fromParam("id", (v) => v.toNumber())
  @fromJson(UpsertRequestDto)
  @producesResponseType(200)
  @producesResponseType(400)
  @producesResponseType(401)
  @producesResponseType(403)
  @producesResponseType(404)
  @producesResponseType(422)
  public async updateAsync(args: ApiActionArgs<{ id: number }, undefined, UpsertRequestDto>): Promise<EmptyResponse> {
    await this.menuCategoryService.updateAsync(args.params.id, args.json);
    return this.ok();
  }

  @httpDelete("/:id{[0-9]+}")
  @fromParam("id", (v) => v.toNumber())
  @fromJson(UpsertRequestDto)
  @producesResponseType(200)
  @producesResponseType(401)
  @producesResponseType(403)
  @producesResponseType(404)
  @producesResponseType(422)
  public async deleteAsync(args: ApiActionIdParamArgs<number>): Promise<EmptyResponse> {
    await this.menuCategoryService.deleteAsync(args.params.id);
    return this.ok();
  }
}
