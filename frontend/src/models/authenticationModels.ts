import type { AuthenticationVerifyUserNameAndPasswordRequestDto } from "@hc-management/shared/dtos";

export type SignInModel = {
  userName: string;
  password: string;
  toRequestDto(): AuthenticationVerifyUserNameAndPasswordRequestDto;
};

export function createSignInModel(): SignInModel {
  return {
    userName: "",
    password: "",
    toRequestDto(): AuthenticationVerifyUserNameAndPasswordRequestDto {
      return {
        ...this
      };
    }
  };
}
