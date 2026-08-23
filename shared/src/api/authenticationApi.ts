import type { ApiActionJsonArgs, EmptyResponse } from "./requestAndResponse.js";
import type {
  AuthenticationVerifyUserNameAndPasswordRequestDto as VerifyUserNameAndPasswordRequestDto,
  AuthenticationChangePasswordRequestDto as ChangePasswordRequestDto
} from "../dtos/index.js";

export interface IAuthenticationApi {
  getAccessCookieAsync(args: ApiActionJsonArgs<VerifyUserNameAndPasswordRequestDto>): Promise<EmptyResponse>;
  clearAccessCookieAsync(): Promise<EmptyResponse>;
  changePasswordAsync(args: ApiActionJsonArgs<ChangePasswordRequestDto>): Promise<EmptyResponse>;
}
