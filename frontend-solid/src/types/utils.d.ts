/// <reference types="solid-ctf" />

import type { JSX as SolidJSX, type Component } from "solid-js"; 

declare global {
  export type PropsType<T> = T extends Component<infer P> ? P : never;
  export type JSXElement = SolidJSX.Element;
  export type HTMLAttributes<T> = SolidJSX.HTMLAttributes<T>;
}

export { };
