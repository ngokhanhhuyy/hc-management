import type { VerifyCredentialsRequestDto, ChangePasswordRequestDto } from '#/api';

export class SignInModel {
  public userName: string = '';
  public password: string = '';
  
  public toRequestDto(): VerifyCredentialsRequestDto {
    return {
      userName: this.userName,
      password: this.password
    };
  }
}

export class ChangePasswordModel {
  public currentPassword: string = '';
  public newPassword: string = '';
  public confirmationPassword: string = '';

  public toRequestDto(): ChangePasswordRequestDto {
    return {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    };
  }
}
