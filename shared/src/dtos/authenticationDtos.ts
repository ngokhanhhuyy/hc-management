import * as v from "valibot";
import { ValidationContracts } from "../constants/index.js";

export type AuthenticationVerifyUserNameAndPasswordRequestDto =
  v.InferOutput<typeof AuthenticationVerifyUserNameAndPasswordRequestDto>;
export const AuthenticationVerifyUserNameAndPasswordRequestDto = v.object({
  userName: v.pipe(v.string(), v.minLength(1)),
  password: v.pipe(v.string(), v.minLength(1)),
});

export const AuthenticationChangePasswordRequestDto = v.object({
  newPassword: v.pipe(v.string(), v.minLength(ValidationContracts.User.PasswordMinLength)),
});
