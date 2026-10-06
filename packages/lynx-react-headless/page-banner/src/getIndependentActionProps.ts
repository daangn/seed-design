type Handler = (...args: unknown[]) => unknown;

const ACTION_EVENTS = ["tap", "touchstart", "touchend", "touchcancel"] as const;

function noop() {}

function composeHandlers(first: unknown, second: unknown): unknown {
  if (!first) return second;
  if (!second) return first;
  // Background handlers are plain functions; the guard above leaves only defined handlers.
  const run = [first, second] as Handler[];
  return (...args: unknown[]) => {
    for (const handler of run) handler(...args);
  };
}

function composeMainThreadHandlers(first: unknown, second: unknown): unknown {
  if (!first) return second;
  if (!second) return first;
  // On the Background Thread these are worklet descriptors, so only the Main Thread can call them.
  const firstHandler = first as Handler;
  const secondHandler = second as Handler;
  return (...args: unknown[]) => {
    "main thread";
    firstHandler(...args);
    secondHandler(...args);
  };
}

/**
 * @platform Lynx
 *
 * PageBanner의 Button·CloseButton처럼 Root tap·Scale Feedback과 독립된 action에 펼칠 props로 바꿉니다.
 * `tap`·`touchstart`·`touchend`·`touchcancel`의 `bind*`와 `main-thread:bind*` handler를 같은 스레드의
 * `catch*`로 옮겨 native 이벤트가 Root로 전파되지 않게 합니다. 사용자가 함께 준 `catch*` handler가 먼저
 * 실행됩니다. Background `catch*`는 handler가 없어도 항상 연결해 전파를 막습니다.
 *
 * 다른 props와 합친 최종 props에 적용해야 합니다. 이후에 `bind*` handler를 더하면 그 이벤트는 다시 전파됩니다.
 */
export function getIndependentActionProps<T extends Record<string, unknown>>(
  props: T,
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...props };
  for (const event of ACTION_EVENTS) {
    const bindKey = `bind${event}`;
    const catchKey = `catch${event}`;
    const mainThreadBindKey = `main-thread:${bindKey}`;
    const mainThreadCatchKey = `main-thread:${catchKey}`;
    const mainThreadHandler = composeMainThreadHandlers(
      result[mainThreadCatchKey],
      result[mainThreadBindKey],
    );

    result[catchKey] = composeHandlers(result[catchKey], result[bindKey] ?? noop);
    delete result[bindKey];
    delete result[mainThreadBindKey];
    if (mainThreadHandler) result[mainThreadCatchKey] = mainThreadHandler;
  }
  return result;
}
