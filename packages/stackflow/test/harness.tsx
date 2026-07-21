/**
 * Shared test harness: mounts a real stackflow() app with the seedPlugin so
 * NextAppScreen behavior is exercised against real stackflow state.
 *
 * @stackflow/plugin-renderer-basic is not a dependency of this package, so a
 * minimal equivalent renderer plugin is defined inline.
 */
import { act, render } from "@testing-library/react";
import { stackflow } from "@stackflow/react";
import type { ActivityComponentType, StackflowReactPlugin } from "@stackflow/react";
import { Fragment } from "react";
import { seedPlugin, type SeedPluginOptions } from "../src";

const testRendererPlugin = (): StackflowReactPlugin => () => ({
  key: "test-renderer",
  render({ stack }) {
    return (
      <>
        {stack
          .render()
          .activities.filter((activity) => activity.transitionState !== "exit-done")
          .map((activity) => (
            <Fragment key={activity.key}>{activity.render()}</Fragment>
          ))}
      </>
    );
  },
});

export interface RenderStackOptions {
  activities: Record<string, ActivityComponentType>;
  initialActivity: string;
  theme?: SeedPluginOptions["theme"];
  transitionDuration?: number;
}

export function renderStack(options: RenderStackOptions) {
  const { Stack, actions } = stackflow({
    transitionDuration: options.transitionDuration ?? 80,
    activities: options.activities,
    initialActivity: (() => options.initialActivity) as never,
    plugins: [testRendererPlugin(), seedPlugin({ theme: options.theme ?? "cupertino" })],
  });

  const utils = render(<Stack />);

  return {
    ...utils,
    actions,
    push: async (name: string) => {
      await act(async () => {
        actions.push(name as never, {} as never);
      });
    },
    pop: async () => {
      await act(async () => {
        actions.pop();
      });
    },
  };
}

export const getScreens = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>('[data-part="screen"]'));

export function getScreen(container: HTMLElement, testId: string) {
  const screen = container.querySelector<HTMLElement>(`[data-testid="${testId}"]`);
  if (!screen) throw new Error(`screen not found: ${testId}`);

  return screen;
}

export const getPart = (screen: HTMLElement, part: string) =>
  screen.querySelector<HTMLElement>(`[data-part="${part}"]`);

/**
 * Poll until `check` stops throwing. testing-library's `waitFor` turned out to
 * be flaky under bun + happy-dom (act-environment interplay), so tests use
 * this plain sleep-loop instead.
 */
export async function poll(
  check: () => void,
  { timeout = 3000, interval = 20 }: { timeout?: number; interval?: number } = {},
) {
  const deadline = Date.now() + timeout;

  for (;;) {
    try {
      check();
      return;
    } catch (error) {
      if (Date.now() > deadline) throw error;
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }
}

/** Wait until every mounted screen reaches a resting state. */
export async function settle(container: HTMLElement) {
  await poll(() => {
    const screens = getScreens(container);
    if (screens.length === 0) throw new Error("no screens mounted");

    for (const screen of screens) {
      const state = screen.dataset["screenState"];
      if (state !== "idle" && state !== "idle-behind") {
        throw new Error(`screen not settled: ${state}`);
      }
    }
  });
}
