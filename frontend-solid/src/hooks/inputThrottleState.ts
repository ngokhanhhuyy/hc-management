type QueueRequest = {
  id: number;
  callback: () => Promise<void>;
};

export function useThrottledState<T>(state: T, delayInMilliseconds: number = 500): T {
  let throttledState = $state<T>(state);
  let isInitialRendering = $state<boolean>(true);
  const queue: QueueRequest[] = [];
  let latestRequestId = -1;

  // Life cycle hooks.
  $watch([state], () => {
    if (isInitialRendering) {
      isInitialRendering = true;
      return;
    }
    
    const requestId = latestRequestId += 1;
    const executeAsync = async () => {
      throttledState = state;
      await new Promise(resolve => setTimeout(resolve, delayInMilliseconds));
      if (queue[0].id == requestId) {
        queue.splice(0, 1);
      }

      if (queue.length > 0) {
        queue[0].callback();
      }
    };

    if (queue.length == 0) {
      queue[0] = ({
        id: requestId,
        callback: executeAsync
      });

      executeAsync();
    } else {
      queue[1] = ({
        id: requestId,
        callback: executeAsync
      });
    }
  });

  // Results.
  return throttledState;
}
