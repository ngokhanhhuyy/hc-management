// fetch.ts

const originalFetch = globalThis.fetch;

const cookieJar = new Map<string, string>();

function getCookieKey(cookie: string): string {
  return cookie.split(";", 1)[0].split("=", 1)[0];
}

function getCookiePair(cookie: string): string {
  return cookie.split(";", 1)[0];
}

function storeCookies(response: Response) {
  const setCookies = typeof response.headers.getSetCookie === "function" ? response.headers.getSetCookie() : [];

  for (const cookie of setCookies) {
    const key = getCookieKey(cookie);
    const pair = getCookiePair(cookie);

    cookieJar.set(key, pair);
  }
}

function getCookies(): string {
  return [...cookieJar.values()].join("; ");
}

async function cookieFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);
  headers.append("Content-Type", "application/json");

  const cookies = getCookies();

  if (cookies && !headers.has("Cookie")) {
    headers.set("Cookie", cookies);
  }

  // IMPORTANT: call the original fetch
  const response = await originalFetch(input, {
    ...init,
    headers,
  });

  storeCookies(response);

  return response;
}

globalThis.fetch = cookieFetch;
