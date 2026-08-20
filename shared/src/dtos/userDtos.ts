import * as v from "valibot";
import { ValidationContracts } from "../constants/index.js";
import { UserBasicResponseDto } from "./sharedDtos.js";

export type UserDetailResponseDto = v.InferOutput<typeof UserDetailResponseDto>;
export const UserDetailResponseDto = v.object({
  ...UserBasicResponseDto.entries
});

export type UserCreateRequestDto = v.InferOutput<typeof UserCreateRequestDto>;
export const UserCreateRequestDto = v.object({
  userName: v.pipe(v.string(), v.minLength(ValidationContracts.User.UserNameMinLength)),
  password: v.pipe(v.string(), v.minLength(ValidationContracts.User.PasswordMinLength)),
});
