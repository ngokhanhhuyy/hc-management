import * as v from "valibot";
import { ValidationContracts } from "../constants/index.js";
import { OrderBasicResponseDto } from "./orderDtos.js";

export type SeatingBasicResponseDto = v.InferOutput<typeof SeatingBasicResponseDto>;
export const SeatingBasicResponseDto = v.object({
  id: v.number(),
  name: v.string(),
  isActive: v.boolean()
});

export type SeatingDetailResponseDto = v.InferOutput<typeof SeatingDetailResponseDto>;
export const SeatingDetailResponseDto = v.object({
  id: v.number(),
  name: v.string(),
  activeOrder: v.nullable(OrderBasicResponseDto)
});
