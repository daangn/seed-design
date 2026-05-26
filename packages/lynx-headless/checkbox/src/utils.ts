import type { ReactNode } from "react";

export type RenderProp<State> = ReactNode | ((state: State) => ReactNode);

export function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ") || undefined;
}

export function renderWithState<State>(children: RenderProp<State> | undefined, state: State) {
  return typeof children === "function" ? children(state) : children;
}
