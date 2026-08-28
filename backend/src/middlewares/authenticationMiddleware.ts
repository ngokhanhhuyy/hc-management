import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { jwtVerify, type JWTPayload } from "jose";
import { UserDetailResponseDto } from "@hc-management/shared/dtos";
import { AuthenticationError } from "@hc-management/shared/errors";
import * as v from "valibot";

export const authenticationMiddleware = createMiddleware(async (context, next) => {
  const cookieValue = getCookie(context, "Authorization");
  const expectedPrefix = "Bearer ";
  if (!cookieValue || cookieValue.length <= expectedPrefix.length || !cookieValue.startsWith(expectedPrefix)) {
    return context.body(null, 401);
  }

  const secretKey = new TextEncoder().encode(process.env.SECRET_KEY!);
  const cookieToken = cookieValue.slice(expectedPrefix.length);
  let payload: JWTPayload;
  try {
    const verifyResult = await jwtVerify(cookieToken, secretKey);
    payload = verifyResult.payload;
  } catch (error) {
    throw new AuthenticationError();
  }
  
  if (!v.is(UserDetailResponseDto, payload)) {
    throw new AuthenticationError();
  }

  const serviceProvider = context.get("provider");
  const callerDetailProvider = serviceProvider.getRequiredService("callerDetailProvider");
  callerDetailProvider.setCallerDetail(payload);

  await next();
});
