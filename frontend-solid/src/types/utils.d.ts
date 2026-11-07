declare global {
  export type PropsType<T> = T extends Component<infer P> ? P : never;
  export type HTMLAttributes<T> = JSX.HTMLAttributes<T>;
}

export { };
