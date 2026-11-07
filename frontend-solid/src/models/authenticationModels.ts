import type { VerifyCredentialsRequestDto, ChangePasswordRequestDto } from "#/api";

export type SignInModel = {
  userName: string;
  password: string;
  toRequestDto(): VerifyCredentialsRequestDto;
};

export type ChangePasswordModel = {
  currentPassword: string;
  newPassword: string;
  confirmationPassword: string;
  toRequestDto(): ChangePasswordRequestDto;
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

export function createChangePasswordModel(): ChangePasswordModel {
  return {
    currentPassword: "",
    newPassword: "",
    confirmationPassword: "",
    toRequestDto(): ChangePasswordRequestDto {
      return {
        currentPassword: this.currentPassword,
        newPassword: this.newPassword
      };
    }
  };
}
