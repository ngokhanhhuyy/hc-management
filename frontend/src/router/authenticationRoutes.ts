import { lazy } from "react";
import type { RouteObject } from "react-router";

const SignInPage = lazy(() => import("#/pages/authentication/SignInPage"));

export const authenticationRoutes: RouteObject = {
  path: "sign-in",
  Component: SignInPage,
  handle: {
    pageTitle: "Đăng nhập"
  }
};
