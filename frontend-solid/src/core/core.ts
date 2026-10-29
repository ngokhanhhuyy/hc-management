import {
  createSignal,
  createMemo,
  createEffect,
  on,
  onMount,
  onCleanup,
  mergeProps,
  splitProps
} from "solid-js";
import { createContext, useContext } from "solid-js";
import { createMutable } from "solid-js/store";

type State<T> = {
  value: T;
};

type ObjectState<T extends object> = { [K in keyof T]: T[K] };

function createState<T>(): State<T | undefined>;
function createState<T>(arg: T | (() => T)): State<T>;
function createState<T>(arg?: T | (() => T)): State<T | undefined> {
  const computeValue = (valueGetter: T | (() => T)): T => {
    let value = typeof valueGetter === "function" ? (valueGetter as (() => T))() : valueGetter;
    if (value != null && typeof value === "object" && typeof value != "function") {
      value = createMutable(value);
    }

    return value;
  };

  const [signal, setSignal] = createSignal(arg && computeValue(arg));

  return {
    get value(): T | undefined {
      return signal();
    },
    set value(v: T | undefined) {
      setSignal(() => v && computeValue(v));
    }
  };
}

function createObjectState<T extends object>(arg: T | (() => T)): ObjectState<T> {
  return createMutable(typeof arg === "function" ? arg() : arg);
}

type ComputedState<T> = {
  readonly value: T;
};

function createComputedState<T>(fn: () => T): ComputedState<T> {
  const computedValue = createMemo(fn);

  return {
    get value(): T {
      return computedValue();
    }
  };
}

type ObjectMemoArgs = { [key: string]: any };
type ObjectMemo<T extends ObjectMemoArgs> = Readonly<{ [K in keyof T]: T[K] extends Function ? ReturnType<T[K]> : T[K] }>;
function createComputedObjectState<T extends ObjectMemoArgs>(arg: T): ObjectMemo<T> {
  const computedObject = { } as ObjectMemo<T>;
  for (const [key, getter] of Object.entries(arg)) {
    Object.defineProperty(computedObject, key, {
      get() {
        if (typeof getter === "function") {
          return getter();
        }

        return getter;
      },
      enumerable: true,
      configurable: false
    });
  }

  return computedObject;
}

function createWatcher(...args: Parameters<typeof on>): void {
  return createEffect(on(...args));
}

export {
  createState,
  createObjectState,
  createComputedState,
  createComputedObjectState,
  createEffect,
  createWatcher,
  createContext,
  useContext,
  onMount,
  onCleanup,
  mergeProps,
  splitProps,
  type State,
  type ComputedState,
};
