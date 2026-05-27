import type { ReactNode } from "react";

export type RenderProp<State> = ReactNode | ((state: State) => ReactNode);

export function renderWithState<State>(children: RenderProp<State> | undefined, state: State) {
  return typeof children === "function" ? children(state) : children;
}
