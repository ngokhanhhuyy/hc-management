import { Temporal } from "@js-temporal/polyfill";

console.log(new Date().toISOString());
const isoString = new Date().toISOString().split(".")[0];
console.log(isoString);
console.log(Temporal.PlainDateTime.from(isoString).add({ hours: 7 }).toString());

function getDateTimeParts(date: Date) {
  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
    hourCycle: "h23",
  });

  return Object.fromEntries(
    formatter.formatToParts(date)
      .filter(x => x.type !== "literal")
      .map(x => [x.type, x.value])
  );
}

// export function createDateTimeResponseDto(date: Date): string {

// }
