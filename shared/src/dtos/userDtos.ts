import * as v from "valibot";
import { ValidationContracts } from "../constants/index.js";

export type UserBasicResponseDto = v.InferOutput<typeof UserBasicResponseDto>;
export const UserBasicResponseDto = v.object({
  id: v.number(),
  userName: v.string()
});

export type UserCreateRequestDto = v.InferOutput<typeof UserCreateRequestDto>;
export const UserCreateRequestDto = v.object({
  userName: v.pipe(v.string(), v.minLength(ValidationContracts.User.UserNameMinLength)),
  password: v.pipe(v.string(), v.minLength(ValidationContracts.User.PasswordMinLength)),
});
