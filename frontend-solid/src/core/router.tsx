import {
  A,
  useMatch as useSolidMatch,
  useCurrentMatches as useSolidCurrentMatches,
  useBeforeLeave,
  useIsRouting,
  useNavigate,
  useLocation,
  Router,
  Route,
  Navigate,
  type PathMatch,
  type RouteMatch
} from "@solidjs/router";
import { createComputedState, type ComputedState } from "./core";

const RouterLink = A;

function useMatch(...args: Parameters<typeof useSolidMatch>): ComputedState<PathMatch | undefined> {
  const match = useSolidMatch(...args);
  return createComputedState(() => match());
}

function useCurrentMatches(...args: Parameters<typeof useSolidCurrentMatches>): ComputedState<RouteMatch[]> {
  const currentMatches = useSolidCurrentMatches(...args);
  return createComputedState(() => currentMatches());
}

export {
  useMatch,
  useCurrentMatches,
  useBeforeLeave,
  useIsRouting,
  useNavigate,
  useLocation,
  Router,
  Route,
  Navigate,
  RouterLink
};
