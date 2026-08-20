import * as v from "valibot";
import type { Implements } from "../helpers/index.js";
import type { IListRequestDto, IListResponseDto } from "./interfaces.js";
import { ISODateToTemporalPlainDateTransformer, NullableISODateToTemporalPlainDateTransformer } from "./transformer.js";
import {
  SeatingBasicResponseDto,
  UserBasicResponseDto,
  OrderBasicResponseDto
} from "./sharedDtos.js";

export type OrderListRequestDto = Implements<IListRequestDto, v.InferOutput<typeof OrderListRequestDto>>;
export const OrderListRequestDto = v.object({
  sortByAscending: v.optional(v.boolean(), false),
  sortByFieldName: v.optional(
    v.picklist(["createdDateTime", "lastUpdatedDateTime", "finishedDateTime", "itemAmount"]),
    "finishedDateTime"),
  page: v.optional(v.number(), 1),
  resultsPerPage: v.optional(v.pipe(v.number(), v.minValue(5), v.maxValue(50)), 15),
  createdDate: v.optional(v.nullable(v.pipe(v.string(), v.isoDate())), null)
});

export type OrderListResponseDto = Implements<
  IListResponseDto<OrderBasicResponseDto>,
  v.InferOutput<typeof OrderListResponseDto>>;
export const OrderListResponseDto = v.object({
  items: v.array(OrderBasicResponseDto),
  pageCount: v.number(),
  itemCount: v.number()
});

export type OrderDetailResponseDto = v.InferOutput<typeof OrderDetailResponseDto>;
export const OrderDetailResponseDto = v.object({
  id: v.number(),
  createdDateTime: v.pipe(v.string(), v.isoDate(), ISODateToTemporalPlainDateTransformer),
  lastUpdatedDateTime: v.pipe(
    v.nullable(v.pipe(v.string(), v.isoDate())),
    NullableISODateToTemporalPlainDateTransformer),
  finishedDateTime: v.pipe(
    v.nullable(v.pipe(v.string(), v.isoDate())),
    NullableISODateToTemporalPlainDateTransformer),
  itemAmount: v.number(),
  createdUser: UserBasicResponseDto,
  lastUpdatedUser: v.nullable(UserBasicResponseDto),
  finishedUser: v.nullable(UserBasicResponseDto),
  seating: SeatingBasicResponseDto
});
