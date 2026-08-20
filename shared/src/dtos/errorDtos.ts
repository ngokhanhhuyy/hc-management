import * as v from "valibot";
import type { ErrorDetails } from "../errors/index.js"; 

export type ProblemDetails = {
  type: string,
  title: string,
  status: number;
  detail: ErrorDetails;
  instance: string;
};
