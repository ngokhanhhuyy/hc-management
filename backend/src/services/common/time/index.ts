import { Temporal } from "@js-temporal/polyfill";

let timezone = parseInt(import.meta.env.TIMEZONE as string);
if (isNaN(timezone)) {
  timezone = 7;
}

export interface IClock {
  today(): Temporal.PlainDate;
  now(): Temporal.PlainDateTime;
  convertJSDateToTemporalPlainDateTime(jsDate: Date): Temporal.PlainDateTime;
  convertJSDateToTemporalPlainDate(jsDate: Date): Temporal.PlainDate;
  convertJSDateToDateISOString(jsDate: Date): string;
  convertJSDateToDateTimeISOString(jsDate: Date): string;
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
    const isoString = jsDate.toISOString().split(".")[0];
    return Temporal.PlainDateTime.from(isoString).add({ hours: timezone });
  }

  public convertJSDateToDateISOString(jsDate: Date): string {
    return this.convertJSDateToTemporalPlainDate(jsDate).toString();
  }

  public convertJSDateToDateTimeISOString(jsDate: Date): string {
    return this.convertJSDateToTemporalPlainDateTime(jsDate).toString();
  }
}
