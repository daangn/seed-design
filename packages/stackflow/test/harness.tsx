/**
 * Shared test harness: mounts a real stackflow() app with the seedPlugin so
 * NextAppScreen behavior is exercised against real stackflow state.
 *
 * @stackflow/plugin-renderer-basic is not a dependency of this package, so a
 * minimal equivalent renderer plugin is defined inline.
 */
import { spyOn } from "bun:test";
import { act, render } from "@testing-library/react";
import { stackflow } from "@stackflow/react";
import type { ActivityComponentType, StackflowReactPlugin } from "@stackflow/react";
import { Fragment } from "react";
import { seedPlugin, type SeedPluginOptions } from "../src";
import { finishAnimations, resetAnimations } from "./waapi";

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
  swipeBackArea?: SeedPluginOptions["swipeBackArea"];
  clipRadius?: SeedPluginOptions["clipRadius"];
  transitionDuration?: number;
}

export function renderStack(options: RenderStackOptions) {
  resetAnimations();

  const { Stack, actions } = stackflow({
    transitionDuration: options.transitionDuration ?? 80,
    activities: options.activities,
    initialActivity: (() => options.initialActivity) as never,
    plugins: [
      testRendererPlugin(),
      seedPlugin({
        theme: options.theme ?? "cupertino",
        swipeBackArea: options.swipeBackArea,
        clipRadius: options.clipRadius,
      }),
    ],
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

export const touchInit = (x: number, y: number) => ({
  touches: [{ clientX: x, clientY: y }],
  changedTouches: [{ clientX: x, clientY: y }],
});

export const nextFrame = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });

/**
 * Deterministic `Date.now` so a gesture's velocity is controllable — without
 * it a touchmove fired in the same millisecond as the touchstart reads as an
 * arbitrarily fast flick and crosses the velocity threshold.
 */
export function createClock() {
  let value = 100_000;
  const spy = spyOn(Date, "now").mockImplementation(() => value);

  return {
    advance: (ms: number) => {
      value += ms;
    },
    restore: () => spy.mockRestore(),
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

/**
 * Wait until every mounted screen reaches a resting state.
 *
 * Also reports the transition animations as complete: the stub never ends one
 * on its own, and a screen at rest in a browser is one whose motion has run
 * out. Without this a settled stack would still look mid-transition.
 */
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

  finishAnimations();
}
