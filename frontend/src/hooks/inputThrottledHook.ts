import { useState, useRef, useEffect } from "react";

type QueueRequest = {
  id: number;
  callback: () => Promise<void>;
};

export function useThrottledState<T>(state: T, delayInMilliseconds: number = 500): T {
  const [throttledState, setThrottledState] = useState<T>(state);
  const [isInitialRendering, setIsInitialRendering] = useState<boolean>(true);
  const queue = useRef<QueueRequest[]>([]);
  const latestRequestId = useRef<number>(-1);

  // Effect.
  useEffect(() => {
    if (isInitialRendering) {
      setIsInitialRendering(false);
      return;
    }
    
    const requestId = latestRequestId.current += 1;
    const executeAsync = async () => {
      setThrottledState(state);
      await new Promise(resolve => setTimeout(resolve, delayInMilliseconds));
      if (queue.current[0].id == requestId) {
        queue.current.splice(0, 1);
      }

      if (queue.current.length > 0) {
        queue.current[0].callback();
      }
    };

    if (queue.current.length == 0) {
      queue.current[0] = ({
        id: requestId,
        callback: executeAsync
      });

      executeAsync();
    } else {
      queue.current[1] = ({
        id: requestId,
        callback: executeAsync
      });
    }
  }, [state]);

  // Results.
  return throttledState;
}
