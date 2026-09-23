import type { VerifyCredentialsRequestDto } from "#/api";

export type SignInModel = {
  userName: string;
  password: string;
  toRequestDto(): VerifyCredentialsRequestDto;
};

export function createSignInModel(): SignInModel {
  return {
    userName: "",
    password: "",
    toRequestDto(): VerifyCredentialsRequestDto {
      return {
        ...this
      };
    }
  };
}
