import type { JsonValue } from "@hc-management/shared/api";
import type { ProblemDetails } from "@hc-management/shared/dtos";
import {
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  ConcurrencyError,
  OperationError
} from "@hc-management/shared/errors";

type RequestOptions = {
  method: string;
  query?: object;
  body?: JsonValue;
};

export const httpClient = {
  sendAndParseAsync,
  sendAndIgnoreAsync
};

async function sendAndParseAsync<TResponseDto>(endpoint: string, options: RequestOptions): Promise<TResponseDto> {
  const response = await sendAsync(endpoint, options);
  if (response.status >= 200 && response.status < 300) {
    return await response.json() as TResponseDto;
  }

  throw await convertToErrorAsync(response);
}

async function sendAndIgnoreAsync(endpoint: string, options: RequestOptions): Promise<void> {
  const response = await sendAsync(endpoint, options);
  if (response.status >= 200 && response.status < 400) {
    return;
  }

  throw await convertToErrorAsync(response);
}

async function sendAsync(endpoint: string, options: RequestOptions): Promise<Response> {
  let url = endpoint;
  if (options.query) {
    const query: Record<string, string> = { };
    for (const [key, value] of Object.entries(options.query)) {
      query[key] = value?.toString() ?? "";
    }

    const searchParams = new URLSearchParams(query);
    url += "?" + searchParams.toString();
  }

  return await fetch(`/api${url}`, {
    method: options.method,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    headers: {
      "Content-Type": "application/json",
      "X-Identifier": "@binary-codec-tools"
    }
  });
}

async function convertToErrorAsync(response: Response): Promise<Error> {
  switch (response.status) {
    case 400: {
      const problemDetails = await response.json() as ProblemDetails;
      return new ValidationError(problemDetails.detail);
    }

    case 401:
      return new AuthenticationError();

    case 403:
      return new AuthorizationError();

    case 409:
      return new ConcurrencyError();

    case 422: {
      const problemDetails = await response.json() as ProblemDetails;
      return new OperationError(problemDetails.detail);
    }

    default:
      throw new Error(`Undefined error occurred with payload.`);
  }
}
