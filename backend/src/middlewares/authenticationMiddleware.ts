import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { jwtVerify } from "jose";
import { UserDetailResponseDto } from "@hc-management/shared/dtos";
import { AuthenticationError } from "@hc-management/shared/errors";
import * as v from "valibot";

export const authenticationMiddleware = createMiddleware(async (context, next) => {
  const ignoredPaths = [
    "/api/authentication/get-access-cookie"
  ];

  if (ignoredPaths.find(path => context.req.path.includes(path))) {
    await next();
    return;
  }

  const cookieValue = getCookie(context, "Authorization");
  const expectedPrefix = "Bearer ";
  if (!cookieValue || cookieValue.length <= expectedPrefix.length || !cookieValue.startsWith(expectedPrefix)) {
    return context.body(null, 401);
  }

  const secretKey = new TextEncoder().encode(process.env.SECRET_KEY!);
  const cookieToken = cookieValue.slice(expectedPrefix.length);
  const { payload } = await jwtVerify(cookieToken, secretKey);
  if (!v.is(UserDetailResponseDto, payload)) {
    throw new AuthenticationError();
  }

  await next();
});
