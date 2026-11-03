import type { TopNavigationButton } from "./adapter";

/**
 * What the app passes to `HostUIProvider` as `topNavigation`, to draw the bar SEED sends it.
 *
 * @experimental
 */
export interface TopNavigationHost {
  /**
   * Replaces the whole bar. Rejects when the host could not draw it and kept the previous one.
   */
  update: (
    id: string,
    bar: TopNavigationHostBar,
    options: { animated: boolean },
  ) => Promise<unknown>;
  /** `id` is the update the pressed button came from. */
  onButtonClick: (listener: (event: TopNavigationHostButtonClick) => void) => () => void;
}

/** @experimental */
export interface TopNavigationHostBar {
  title?: string;
  subtitle?: string;
  buttons: TopNavigationHostButton[];
}

/** @experimental */
export type TopNavigationHostButton = Omit<TopNavigationButton, "onClick" | "identity"> & {
  /** Unique within one bar, and the same for the same button across updates. */
  key: string;
};

/** @experimental */
export interface TopNavigationHostButtonClick {
  id: string;
  key: string;
}
