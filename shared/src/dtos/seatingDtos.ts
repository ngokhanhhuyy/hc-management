import * as v from "valibot";
import { OrderBasicResponseDto } from "./sharedDtos.js";

export type SeatingDetailResponseDto = v.InferOutput<typeof SeatingDetailResponseDto>;
export const SeatingDetailResponseDto = v.object({
  id: v.number(),
  name: v.string(),
  activeOrder: v.nullable(OrderBasicResponseDto)
});
