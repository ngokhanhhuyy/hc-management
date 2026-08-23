import { Temporal } from "@js-temporal/polyfill";
import { customType } from "drizzle-orm/pg-core";

export const temporalPlainDateTime = customType<{ data: Temporal.PlainDateTime; driverData: string; }>({
  dataType() {
    return "timestamp without time zone";
  },
  fromDriver(value) {
    return Temporal.PlainDateTime.from(value);
  },
  toDriver(value) {
    return value.toString();
  }
});
