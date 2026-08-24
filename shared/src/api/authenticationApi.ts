import type { EmptyResponse } from "./requestAndResponse.js";
import type {
  AuthenticationVerifyUserNameAndPasswordRequestDto as VerifyUserNameAndPasswordRequestDto,
  AuthenticationChangePasswordRequestDto as ChangePasswordRequestDto
} from "../dtos/index.js";

export interface IAuthenticationApi {
  getAccessCookieAsync(requestDto: VerifyUserNameAndPasswordRequestDto): Promise<void>;
  clearAccessCookieAsync(): Promise<void>;
  changePasswordAsync(requestDto: ChangePasswordRequestDto): Promise<void>;
}
