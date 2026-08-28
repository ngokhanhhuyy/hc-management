import { httpClient } from "./httpClient";
import type { IAuthenticationApi } from "@hc-management/shared/api";
import type {
  AuthenticationVerifyUserNameAndPasswordRequestDto,
  AuthenticationChangePasswordRequestDto
} from "@hc-management/shared/dtos";

const authenticationApiPath = "/authentication";

export const authenticationApi: IAuthenticationApi = {
  async getAccessCookieAsync(requestDto: AuthenticationVerifyUserNameAndPasswordRequestDto): Promise<void> {
    await httpClient.sendAndIgnoreAsync(`${authenticationApiPath}/get-access-cookie`, {
      method: "post",
      body: requestDto
    });
  },

  async clearAccessCookieAsync(): Promise<void> {
    await httpClient.sendAndIgnoreAsync(`${authenticationApiPath}/clear-access-cookie`, {
      method: "post",
    });
  },

  async checkStatusAsync(): Promise<void> {
    await httpClient.sendAndIgnoreAsync(`${authenticationApiPath}/check-status`, {
      method: "get"
    });
  },
  
  async changePasswordAsync(requestDto: AuthenticationChangePasswordRequestDto): Promise<void> {
    await httpClient.sendAndIgnoreAsync(`${authenticationApiPath}/change-password`, {
      method: "post",
      body: requestDto
    });
  }
};
