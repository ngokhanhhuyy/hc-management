import { type Context } from "hono";
import { BaseController } from "#/mvc/baseController";
import {
  route,
  httpGet,
  httpQuery,
  httpPost,
  httpPut,
  httpDelete,
  fromBody,
  fromRoute,
  fromQuery,
  producesResponseType,
  authorized,
} from "#/mvc";
import type { IMenuItemService } from "#/services/features/menuItemService";
import type { IMenuItemApi } from "@hc-management/shared/api";
import {
  MenuItemListRequestDto,
  MenuItemUpsertRequestDto,
  type MenuItemBasicResponseDto,
  type MenuItemDetailResponseDto
} from "@hc-management/shared/dtos";

@route("/api/menu-categories")
@authorized
export class MenuItemController extends BaseController implements IMenuItemApi {
  private readonly menuItemService: IMenuItemService;

  public constructor(httpContext: Context) {
    super(httpContext);
    this.menuItemService = this.serviceProvider.getRequiredService("menuItemService");
  }

  @httpQuery("/")
  @fromQuery(0, MenuItemListRequestDto)
  @producesResponseType<MenuItemBasicResponseDto[]>(200)
  public async getListAsync(requestDto: MenuItemListRequestDto): Promise<MenuItemBasicResponseDto[]> {
    return this.ok(await this.menuItemService.getListAsync(requestDto));
  }

  @httpGet("/:id{[0-9]+}")
  @fromRoute(0, "id", (v) => v.toNumber())
  @producesResponseType<MenuItemDetailResponseDto>(200)
  @producesResponseType(401)
  @producesResponseType(403)
  @producesResponseType(404)
  public async getDetailAsync(id: number): Promise<MenuItemDetailResponseDto> {
    return this.ok(await this.menuItemService.getDetailAsync(id));
  }

  @httpPost("/")
  @fromBody(0, MenuItemUpsertRequestDto)
  @producesResponseType<number>(201)
  @producesResponseType(400)
  @producesResponseType(401)
  @producesResponseType(403)
  @producesResponseType(422)
  public async createAsync(requestDto: MenuItemUpsertRequestDto): Promise<number> {
    const createdId = await this.menuItemService.createAsync(requestDto);
    return this.created(`/api/menu-category/${createdId}`, createdId);
  }

  @httpPut("/:id{[0-9]+}")
  @fromRoute(0, "id", (v) => v.toNumber())
  @fromBody(1, MenuItemUpsertRequestDto)
  @producesResponseType(200)
  @producesResponseType(400)
  @producesResponseType(401)
  @producesResponseType(403)
  @producesResponseType(404)
  @producesResponseType(422)
  public async updateAsync(id: number, requestDto: MenuItemUpsertRequestDto): Promise<void> {
    await this.menuItemService.updateAsync(id, requestDto);
    return this.ok();
  }

  @httpDelete("/:id{[0-9]+}")
  @fromRoute(0, "id", (v) => v.toNumber())
  @fromBody(1, MenuItemUpsertRequestDto)
  @producesResponseType(200)
  @producesResponseType(401)
  @producesResponseType(403)
  @producesResponseType(404)
  @producesResponseType(422)
  public async deleteAsync(id: number): Promise<void> {
    await this.menuItemService.deleteAsync(id);
    return this.ok();
  }
}
