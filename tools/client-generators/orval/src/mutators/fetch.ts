import {
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  ConcurrencyError,
  OperationError,
  type ErrorDetails
} from "./errors";

export const fetchAndThrowAsync = async <TResponse>(url: string, options: RequestInit): Promise<TResponse> => {
  const response = await globalThis.fetch(url, options);
  if (response.status >= 200 && response.status < 300) {
    const rawText = await response.text();
    const text = rawText.trim();
    if (text) {
      return JSON.parse(text) as TResponse;
    }

    return undefined as TResponse;
  }

  throw await convertToErrorAsync(response);
};

async function convertToErrorAsync(response: Response): Promise<Error> {
  type ProblemDetails = { errors: ErrorDetails };
  const getDetails = async () => {
    const problemDetails = await response.json() as ProblemDetails;
    return problemDetails.errors;
  };
  
  switch (response.status) {
    case 400: {
      return new ValidationError(await getDetails());
    }

    case 401:
      return new AuthenticationError();

    case 403:
      return new AuthorizationError();

    case 409:
      return new ConcurrencyError();

    case 422: {
      return new OperationError(await getDetails());
    }

    default:
      throw new Error(`Undefined error occurred with payload.`);
  }
}
