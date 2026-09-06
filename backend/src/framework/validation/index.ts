import * as v from "valibot";
import { errorMessages } from "@hc-management/shared/localization";

v.setSpecificMessage(v.minValue, issue => errorMessages.greaterThanOrEqualsTo(issue.requirement as number));
v.setSpecificMessage(v.maxValue, issue => errorMessages.lessThanOrEqualsTo(issue.requirement as number));
v.setSpecificMessage(v.gtValue, issue => errorMessages.greaterThan(issue.requirement as number));
v.setSpecificMessage(v.ltValue, issue => errorMessages.lessThan(issue.requirement as number));

v.setSpecificMessage(v.minLength, issue => {
  const type = typeof issue.path![0].input === "string" ? "string" : "array";
  return errorMessages.minLength(issue.requirement as number, type);
});

v.setSpecificMessage(v.maxLength, issue => {
  const type = typeof issue.path![0].input === "string" ? "string" : "array";
  return errorMessages.maxLength(issue.requirement as number, type);
});
