import * as v from "valibot";

export const NullableISODateToTemporalPlainDateTransformer =
  v.transform<string | null, Temporal.PlainDate | null>(value => value ? Temporal.PlainDate.from(value) : null);

  
export const ISODateToTemporalPlainDateTransformer =
  v.transform<string, Temporal.PlainDate>(value => Temporal.PlainDate.from(value));
