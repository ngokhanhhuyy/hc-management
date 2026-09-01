import { type Context } from "hono";
import {
  BaseController,
  controller,
  route,
  httpGet,
  httpQuery,
  httpPost,
  // httpPut,
  // httpDelete,
  fromBody,
  fromRoute,
  fromQuery,
  producesResponseType,
  authorize,
} from "#/framework/mvc";
import type { IOrderService } from "#/core/services/orderService";
import type { IOrderApi } from "@hc-management/shared/api";
import {
  OrderListRequestDto,
  OrderListResponseDto,
  OrderUpsertRequestDto,
  type OrderDetailResponseDto
} from "@hc-management/shared/dtos";

@controller
@route("/api/orders")
@authorize
export class OrderController extends BaseController implements IOrderApi {
  private readonly orderService: IOrderService;

  public constructor(httpContext: Context) {
    super(httpContext);
    this.orderService = this.serviceProvider.getRequiredService("orderService");
  }

  @httpQuery("/")
  @fromQuery(0, OrderListRequestDto)
  @producesResponseType<OrderListResponseDto>(200)
  public async getListAsync(requestDto: OrderListRequestDto): Promise<OrderListResponseDto> {
    return this.ok(await this.orderService.getListAsync(requestDto));
  }

  @httpGet("/:id{[0-9]+}")
  @fromRoute(0, "id", "number")
  @producesResponseType<OrderDetailResponseDto>(200)
  @producesResponseType(401)
  @producesResponseType(403)
  @producesResponseType(404)
  public async getDetailAsync(id: number): Promise<OrderDetailResponseDto> {
    return this.ok(await this.orderService.getDetailAsync(id));
  }

  @httpPost("/")
  @fromBody(0, OrderUpsertRequestDto)
  @producesResponseType<number>(201)
  @producesResponseType(400)
  @producesResponseType(401)
  @producesResponseType(403)
  @producesResponseType(422)
  public async createAsync(requestDto: OrderUpsertRequestDto): Promise<number> {
    const createdId = await this.orderService.createAsync(requestDto);
    return this.created(`/api/menu-category/${createdId}`, createdId);
  }

  // @httpPut("/:id{[0-9]+}")
  // @fromRoute(0, "id", "number")
  // @fromBody(1, OrderUpsertRequestDto)
  // @producesResponseType(200)
  // @producesResponseType(400)
  // @producesResponseType(401)
  // @producesResponseType(403)
  // @producesResponseType(404)
  // @producesResponseType(422)
  // public async updateAsync(id: number, requestDto: OrderUpsertRequestDto): Promise<void> {
  //   await this.orderService.updateAsync(id, requestDto);
  //   return this.ok();
  // }

  // @httpDelete("/:id{[0-9]+}")
  // @fromRoute(0, "id", "number")
  // @producesResponseType(200)
  // @producesResponseType(401)
  // @producesResponseType(403)
  // @producesResponseType(404)
  // @producesResponseType(422)
  // public async deleteAsync(id: number): Promise<void> {
  //   await this.orderService.deleteAsync(id);
  //   return this.ok();
  // }
}
