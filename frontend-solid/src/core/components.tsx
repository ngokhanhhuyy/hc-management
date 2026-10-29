import {
  children,
  untrack,
  For as SolidFor,
  Index as SolidIndex,
  Show as SolidShow,
  Switch,
  Match as SolidMatch,
  Suspense,
  ErrorBoundary,
  type JSX,
} from "solid-js";
import { createComputedObjectState, type ComputedState } from "./core";

// Props.
type ForProps<T extends readonly any[], U extends JSX.Element> = {
  each: T | undefined | null | false;
  fallback?: JSX.Element;
  children: (item: T[number], index: ComputedState<number>) => U;
};

type IndexProps<T extends readonly any[], U extends JSX.Element> = {
  each: T | undefined | null | false;
  fallback?: JSX.Element;
  children: (item: ComputedState<T[number]>, index: number) => U;
};

type ShowPropsWithoutIdentityAsKey<T> = {
  when: T | undefined | null | false;
  useIdentityAsKey?: false;
  fallback?: JSX.Element;
  children: JSX.Element | ((item: ComputedState<NonNullable<T>>) => JSX.Element);
};

type ShowPropsWithIdentityAsKey<T> = {
  when: T | undefined | null | false;
  useIdentityAsKey: true;
  fallback?: JSX.Element;
  children: JSX.Element | ((item: NonNullable<T>) => JSX.Element);
};

type ShowProps<T> = ShowPropsWithoutIdentityAsKey<T> | ShowPropsWithIdentityAsKey<T>;

type MatchProps<T> = {
  when: T | undefined | null | false;
  useIdentityAsKey?: false;
  children: JSX.Element | ((item: ComputedState<NonNullable<T>>) => JSX.Element);
} | {
  when: T | undefined | null | false;
  useIdentityAsKey: true;
  children: JSX.Element | ((item: NonNullable<T>) => JSX.Element);
};

// Components.
function For<T extends readonly any[], U extends JSX.Element>(props: ForProps<T, U>): JSX.Element {
  return (
    <SolidFor each={props.each} fallback={props.fallback}>
      {(item, index) => props.children(item, createComputedObjectState({ value: index }))}
    </SolidFor>
  );
}

function Index<T extends readonly any[], U extends JSX.Element>(props: IndexProps<T, U>): JSX.Element {
  return (
    <SolidIndex each={props.each} fallback={props.fallback}>
      {(item, index) => props.children(item(), index)}
    </SolidIndex>
  );
}

function Show<T>(props: ShowProps<T>): JSX.Element {
  if (!props.useIdentityAsKey) {
    return (
      <SolidShow when={props.when} keyed={false} fallback={props.fallback}>
        {(item) => {
          if (typeof props.children === "function") {
            return props.children({
              get value() {
                return item();
              },
            });
          }

          return props.children;
        }}
      </SolidShow>
    );
  }

  return (
    <SolidShow when={props.when} keyed={props.useIdentityAsKey} fallback={props.fallback}>
      {(item) => {
        if (typeof props.children === "function") {
          return props.children(item);
        }

        return props.children;
      }}
    </SolidShow>
  );
}


function Match<T>(props: MatchProps<T>): JSX.Element {
  if (!props.useIdentityAsKey) {
    return (
      <SolidMatch when={props.when} keyed={false}>
        {(item) => {
          if (typeof props.children === "function") {
            return props.children({
              get value() {
                return item();
              },
            });
          }

          return props.children;
        }}
      </SolidMatch>
    );
  }

  return (
    <SolidMatch when={props.when} keyed={props.useIdentityAsKey}>
      {(item) => {
        if (typeof props.children === "function") {
          return props.children(item);
        }

        return props.children;
      }}
    </SolidMatch>
  );
}

// Utils.
const resolveChildren = children;

export {
  resolveChildren,
  untrack,
  For,
  Index,
  Show,
  Switch,
  Match,
  Suspense,
  ErrorBoundary,
  type ForProps,
  type IndexProps,
  type MatchProps
};
