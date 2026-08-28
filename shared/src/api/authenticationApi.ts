import type {
  AuthenticationVerifyUserNameAndPasswordRequestDto,
  AuthenticationChangePasswordRequestDto
} from "../dtos/index.js";

export interface IAuthenticationApi {
  getAccessCookieAsync(requestDto: AuthenticationVerifyUserNameAndPasswordRequestDto): Promise<void>;
  clearAccessCookieAsync(): Promise<void>;
  checkStatusAsync(): Promise<void>;
  changePasswordAsync(requestDto: AuthenticationChangePasswordRequestDto): Promise<void>;
}
