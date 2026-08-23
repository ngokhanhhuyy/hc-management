import type {
  ApiActionArgs,
  ApiActionIdParamArgs,
  ApiActionJsonArgs,
  EmptyResponse,
  JsonResponse
} from "./requestAndResponse.js";
import type { MenuCategoryBasicResponseDto, MenuCategoryUpsertRequestDto } from "@hc-management/shared/dtos";

export interface IMenuCategoryApi {
  getAllAsync(): Promise<JsonResponse<MenuCategoryBasicResponseDto[]>>;
  getSingleAsync(args: ApiActionIdParamArgs<number>): Promise<JsonResponse<MenuCategoryBasicResponseDto>>;
  createAsync(args: ApiActionJsonArgs<MenuCategoryUpsertRequestDto>): Promise<JsonResponse<number>>;
  updateAsync(args: ApiActionArgs<{ id: number }, undefined, MenuCategoryUpsertRequestDto>): Promise<EmptyResponse>;
  deleteAsync(args: ApiActionIdParamArgs<number>): Promise<EmptyResponse>;
}
