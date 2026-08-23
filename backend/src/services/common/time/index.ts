import { Temporal } from "@js-temporal/polyfill";
import "dotenv";

const timezone = process.env.TIMEZONE ?? "Asia/Ho_Chi_Minh";

export interface IClock {
  today(): Temporal.PlainDate;
  now(): Temporal.PlainDateTime;
  getTodayJSDate(): Date;
  getNowJSDate(): Date;
  convertJSDateToTemporalPlainDateTime(jsDate: Date): Temporal.PlainDateTime;
  convertJSDateToTemporalPlainDate(jsDate: Date): Temporal.PlainDate;
  convertJSDateToDateISOString(jsDate: Date): string;
  convertJSDateToDateTimeISOString(jsDate: Date): string;
  convertTemporalPlainDateTimeToJSDate(dateTime: Temporal.PlainDateTime): Date;
}

export class Clock implements IClock {
  public today(): Temporal.PlainDate {
    return this.convertJSDateToTemporalPlainDate(new Date());
  }

  public now(): Temporal.PlainDateTime {
    return this.convertJSDateToTemporalPlainDateTime(new Date());
  }

  public convertJSDateToTemporalPlainDate(jsDate: Date): Temporal.PlainDate {
    return this.convertJSDateToTemporalPlainDateTime(jsDate).toPlainDate();
  }

  public convertJSDateToTemporalPlainDateTime(jsDate: Date): Temporal.PlainDateTime {
    return Temporal.Instant
      .fromEpochMilliseconds(jsDate.getTime())
      .toZonedDateTimeISO(timezone)
      .toPlainDateTime();
  }

  public convertJSDateToDateISOString(jsDate: Date): string {
    return this.convertJSDateToTemporalPlainDate(jsDate).toString();
  }

  public convertJSDateToDateTimeISOString(jsDate: Date): string {
    return this.convertJSDateToTemporalPlainDateTime(jsDate).toString();
  }

  public convertTemporalPlainDateTimeToJSDate(dateTime: Temporal.PlainDateTime): Date {
    return new Date(dateTime.toZonedDateTime(timezone).epochMilliseconds);
  }
}
