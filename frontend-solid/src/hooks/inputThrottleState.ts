
export function useThrottledState<T>(state: Accessor<T>, delayInMilliseconds: number = 500): Accessor<T> {
  const [throttledState, setThrottledState] = createSignal<T>(state());
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let hasPendingValue = false;
  let pendingValue: T;

  // Callbacks.
  function flushPendingValue(): void {
    timeoutId = undefined;
    if (!hasPendingValue) {
      return;
    }

    hasPendingValue = false;
    setThrottledState(() => pendingValue);
    timeoutId = setTimeout(flushPendingValue, delayInMilliseconds);
  }

  // Life cycle hooks.
  createEffect(on(state, value => {
    if (timeoutId === undefined) {
      setThrottledState(() => value);
      timeoutId = setTimeout(flushPendingValue, delayInMilliseconds);
      return;
    }

    pendingValue = value;
    hasPendingValue = true;
  }, { defer: true }));

  onCleanup(() => clearTimeout(timeoutId));

  // Results.
  return throttledState;
}
