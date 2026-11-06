import {
  type TopNavigationBar,
  type TopNavigationButton,
  type TopNavigationButtonsOverride,
  type TopNavigationIcon,
  useTopNavigationAdapter,
} from "@seed-design/host-ui";
import { useActivity, useStack } from "@stackflow/react";
import { useEffect, useLayoutEffect } from "react";

export type { TopNavigationButtonsOverride, TopNavigationIcon };

export type NextAppBarItem = (
  | { icon: TopNavigationIcon; label: string; text?: never }
  | { icon?: never; label?: never; text: string }
) & {
  style?: "plain" | "prominent";
  /** `true` is a dot; a string is drawn inside the badge as it is, so a count is written `"3"`. */
  badge?: true | string;
  enabled?: boolean;
  /** Like a React `key`: only needed when a conditional button would shift the ones after it. */
  identity?: string;
  onClick: () => void;
};

/** Takes falsy values so a button can be added with `condition && { ... }`. */
type NextAppBarSlot = NextAppBarItem | false | null | undefined;

/**
 * A screen's bar, drawn by the host or as a web `NextAppBar`.
 *
 * TODO: `variant` and `showBackground` are placeholder names until the design review settles them.
 * `variant` defaults to `blur` with an accessory and `fade` without.
 */
export type NextAppScreenAppBar = {
  leading?: NextAppBarSlot[];
  trailing?: NextAppBarSlot[];
  pinned?: NextAppBarSlot[];
} & (
  | {
      variant?: "fade" | "blur";
      title?: string;
      subtitle?: string;
      titleColor?: TopNavigationBar["titleColor"];
      showBackground?: never;
    }
  | {
      variant: "immersive";
      /** Draws the background, as once the content under the bar has scrolled past an image. @default false */
      showBackground?: boolean;
      title?: never;
      subtitle?: never;
      titleColor?: never;
    }
);

const SIDES = [
  "leading",
  "trailing",
  "pinned",
] as const satisfies readonly TopNavigationButton["side"][];

const EMPTY_BAR: TopNavigationBar = { buttons: [] };

/** Flattens an `appBar` into the buttons both the host and the web bar draw. */
export function useResolvedAppBar(
  appBar: NextAppScreenAppBar | null | undefined,
): TopNavigationBar | undefined {
  if (!appBar) return;

  return {
    ...(appBar.title !== undefined && { title: appBar.title }),
    ...(appBar.subtitle !== undefined && { subtitle: appBar.subtitle }),
    ...(appBar.titleColor !== undefined && { titleColor: appBar.titleColor }),
    buttons: SIDES.flatMap((side) =>
      (appBar[side] ?? [])
        .filter((item): item is NextAppBarItem => Boolean(item))
        .map((item) => ({ ...item, side })),
    ),
  };
}

// StrictMode cleans an effect up and runs it again at once. Releasing then would give the same
// buttons new keys, so a release waits to see whether the effect comes back.
const pendingReleases = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * Sends the activity's bar to the host each time the activity becomes active. Does nothing when
 * the web draws the bar.
 *
 * A screen without a bar sends an empty one, so the previous screen's bar does not carry over.
 */
export function useActivityAppBar(bar: TopNavigationBar | undefined) {
  const adapter = useTopNavigationAdapter();
  const { id, isActive } = useActivity();

  useLayoutEffect(() => {
    if (!adapter) return;

    adapter.declare(id, bar ?? EMPTY_BAR);
  });

  useEffect(() => {
    if (!adapter) return;

    clearTimeout(pendingReleases.get(id));

    return () => {
      pendingReleases.set(
        id,
        setTimeout(() => adapter.release(id)),
      );
    };
  }, [adapter, id]);

  useEffect(() => {
    if (!adapter || !isActive) return;

    adapter.apply(id);
  }, [adapter, id, isActive]);
}

function useButtonsOverride(
  owner: string | undefined,
  override: TopNavigationButtonsOverride | null | undefined,
) {
  const adapter = useTopNavigationAdapter();

  useEffect(() => {
    if (!adapter || !owner || !override) return;

    return adapter.override(owner, override);
  }, [adapter, owner, override]);
}

/**
 * Hides or disables this screen's bar buttons while an overlay that is not an activity, such as
 * an in-screen BottomSheet, is open. `null` lifts it: `useTopNavigationButtons(open ? "hidden" : null)`.
 *
 * Only the host's bar follows it for now; the web bar keeps its buttons.
 */
export function useTopNavigationButtons(override: TopNavigationButtonsOverride | null | undefined) {
  useButtonsOverride(useActivity().id, override);
}

/**
 * Hides or disables the bar buttons of the screen right below while this sheet or dialog activity
 * is active. Such an activity has no bar of its own, so the bar on screen is still that of the
 * screen below.
 *
 * Only the host's bar follows it for now; the web bar keeps its buttons.
 */
export function useActivityOverlayButtons(
  override: TopNavigationButtonsOverride | null | undefined,
) {
  const { id, isActive } = useActivity();
  const { activities } = useStack();

  const live = activities.filter(
    ({ transitionState }) => transitionState === "enter-active" || transitionState === "enter-done",
  );
  const below = live[live.findIndex((activity) => activity.id === id) - 1]?.id;

  useButtonsOverride(isActive ? below : undefined, override);
}
