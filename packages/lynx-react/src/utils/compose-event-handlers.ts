type Handler = (...args: any[]) => unknown;

export function composeEventHandlers(first: Handler, second: Handler): Handler {
  return (...args) => {
    first(...args);
    second(...args);
  };
}

export function composeMainThreadEventHandlers(first: Handler, second: Handler): Handler {
  return (...args) => {
    "main thread";
    first(...args);
    second(...args);
  };
}
