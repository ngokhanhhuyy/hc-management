import "@solidjs/router";
import type { RouteDefinition, RouteDescription } from "@solidjs/router";

export interface SolidRouteMetadata {
  name: string;
}

declare module "@solidjs/router" {
  export interface RouteDescription {
    info: SolidRouteMetadata;
  }

  interface RouteDefinition {
    info?: SolidRouteMetadata;
  }
}

export { };
