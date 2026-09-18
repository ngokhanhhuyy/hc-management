import { type Context } from "hono";
import {
  BaseController,
  controller,
  route,
  httpGet,
  httpPost,
  httpPut,
  httpDelete,
  fromBody,
  producesResponseType,
  authorize,
  fromRoute
} from "#/framework/mvc";
import type { IMenuCategoryService } from "#/core/services/menuCategoryService";
import type { IMenuCategoryApi } from "@hc-management/shared/api";
import {
  MenuCategoryUpsertRequestDto as UpsertRequestDto,
  type MenuCategoryBasicResponseDto as BasicResponseDto
} from "@hc-management/shared/dtos";

@controller
@route("/api/menu-categories")
@authorize
export class MenuCategoryController extends BaseController implements IMenuCategoryApi {
  private readonly menuCategoryService: IMenuCategoryService;

  public constructor(httpContext: Context) {
    super(httpContext);
    this.menuCategoryService = this.serviceProvider.getRequiredService("menuCategoryService");
  }

  @httpGet("/")
  @producesResponseType<BasicResponseDto[]>(200)
  public async getAllAsync(): Promise<BasicResponseDto[]> {
    return this.ok(await this.menuCategoryService.getAllAsync());
  }

  @httpGet("/:id{[0-9]+}")
  @fromRoute(0, "id", "number")
  @producesResponseType<BasicResponseDto>(200)
  @producesResponseType(401)
  @producesResponseType(403)
  @producesResponseType(404)
  public async getSingleAsync(id: number): Promise<BasicResponseDto> {
    return this.ok(await this.menuCategoryService.getSingleAsync(id));
  }

  @httpPost("/")
  @fromBody(0, UpsertRequestDto)
  @producesResponseType<number>(201)
  @producesResponseType(400)
  @producesResponseType(401)
  @producesResponseType(403)
  @producesResponseType(422)
  public async createAsync(requestDto: UpsertRequestDto): Promise<number> {
    const createdId = await this.menuCategoryService.createAsync(requestDto);
    return this.created(`/api/menu-category/${createdId}`, createdId);
  }

  @httpPut("/:id{[0-9]+}")
  @fromRoute(0, "id", "number")
  @fromBody(1, UpsertRequestDto)
  @producesResponseType(200)
  @producesResponseType(400)
  @producesResponseType(401)
  @producesResponseType(403)
  @producesResponseType(404)
  @producesResponseType(422)
  public async updateAsync(id: number, requestDto: UpsertRequestDto): Promise<void> {
    await this.menuCategoryService.updateAsync(id, requestDto);
    return this.ok();
  }

  @httpDelete("/:id{[0-9]+}")
  @fromRoute(0, "id", "number")
  @producesResponseType(200)
  @producesResponseType(401)
  @producesResponseType(403)
  @producesResponseType(404)
  @producesResponseType(422)
  public async deleteAsync(id: number): Promise<void> {
    await this.menuCategoryService.deleteAsync(id);
    return this.ok();
  }
}
