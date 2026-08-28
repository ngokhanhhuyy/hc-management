import * as v from "valibot";
import { OrderBasicResponseDto } from "./sharedDtos.js";
import { ValidationContracts } from "../constants/index.js";

export type SeatingDetailResponseDto = v.InferOutput<typeof SeatingDetailResponseDto>;
export const SeatingDetailResponseDto = v.object({
  id: v.number(),
  name: v.nullable(v.string()),
  activeOrder: v.nullable(OrderBasicResponseDto)
});

export type SeatingUpsertRequestDto = v.InferOutput<typeof SeatingUpsertRequestDto>;
export const SeatingUpsertRequestDto = v.object({
  name: v.nullable(v.pipe(v.string(), v.maxLength(ValidationContracts.Seating.NameMaxLength)))
});
