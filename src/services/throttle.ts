import { useCallback } from "react";

export function throttle(callback: Function, delay: number) {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: any;

  return function (this: any, ...args: any[]) {
    const now = Date.now();
    lastArgs = args;
    const context = this;
    if (now - lastCall >= delay) {
      lastCall = now;
      callback.apply(context, args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        timeoutId = null;
        callback.apply(context, lastArgs);
      }, delay - (now - lastCall));
    }
  };
}

export function useThrottle(callback: Function, delay: number) {
  return useCallback(throttle(callback, delay), [callback, delay]);
}
