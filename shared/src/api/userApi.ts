import type { ApiActionIdParamArgs, ApiActionJsonArgs, JsonResponse, EmptyResponse } from "./requestAndResponse.js";
import type { UserDetailResponseDto, UserCreateRequestDto } from "../dtos/index.js";

export interface IUserApi {
  getDetailAsync(args: ApiActionIdParamArgs<number>): Promise<JsonResponse<UserDetailResponseDto>>;
  createAsync(args: ApiActionJsonArgs<UserCreateRequestDto>): Promise<JsonResponse<number>>;
}
