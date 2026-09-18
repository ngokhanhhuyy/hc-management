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
  fromRoute,
  producesResponseType,
  authorize,
} from "#/framework/mvc";
import type { ISeatingService } from "#/core/services/seatingService";
import type { ISeatingApi } from "@hc-management/shared/api";
import {
  SeatingUpsertRequestDto,
  type SeatingBasicResponseDto,
  type SeatingDetailResponseDto
} from "@hc-management/shared/dtos";

@controller
@route("/api/seatings")
@authorize
export class SeatingController extends BaseController implements ISeatingApi {
  private readonly seatingService: ISeatingService;

  public constructor(httpContext: Context) {
    super(httpContext);
    this.seatingService = this.serviceProvider.getRequiredService("seatingService");
  }

  @httpGet("/")
  @producesResponseType<SeatingBasicResponseDto[]>(200)
  public async getAllAsync(): Promise<SeatingBasicResponseDto[]> {
    return this.ok(await this.seatingService.getAllAsync());
  }

  @httpGet("/:id{[0-9]+}")
  @fromRoute(0, "id", "number")
  @producesResponseType<SeatingDetailResponseDto>(200)
  @producesResponseType(401)
  @producesResponseType(403)
  @producesResponseType(404)
  public async getDetailAsync(id: number): Promise<SeatingDetailResponseDto> {
    return this.ok(await this.seatingService.getDetailAsync(id));
  }

  @httpPost("/")
  @fromBody(0, SeatingUpsertRequestDto)
  @producesResponseType<number>(201)
  @producesResponseType(400)
  @producesResponseType(401)
  @producesResponseType(403)
  @producesResponseType(422)
  public async createAsync(requestDto: SeatingUpsertRequestDto): Promise<number> {
    const createdId = await this.seatingService.createAsync(requestDto);
    return this.created(`/api/menu-category/${createdId}`, createdId);
  }

  @httpPut("/:id{[0-9]+}")
  @fromRoute(0, "id", "number")
  @fromBody(1, SeatingUpsertRequestDto)
  @producesResponseType(200)
  @producesResponseType(400)
  @producesResponseType(401)
  @producesResponseType(403)
  @producesResponseType(404)
  @producesResponseType(422)
  public async updateAsync(id: number, requestDto: SeatingUpsertRequestDto): Promise<void> {
    await this.seatingService.updateAsync(id, requestDto);
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
    await this.seatingService.deleteAsync(id);
    return this.ok();
  }
}
