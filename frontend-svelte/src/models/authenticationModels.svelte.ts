import type { VerifyCredentialsRequestDto, ChangePasswordRequestDto } from "#/api";

export class SignInModel {
  public userName = $state<string>("");
  public password = $state<string>("");
  
  public toRequestDto(): VerifyCredentialsRequestDto {
    return {
      userName: this.userName,
      password: this.password
    };
  }
}

export class ChangePasswordModel {
  public currentPassword = $state<string>("");
  public newPassword = $state<string>("");
  public confirmationPassword = $state<string>("");

  public toRequestDto(): ChangePasswordRequestDto {
    return {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    };
  }
}
