import type { StackflowReactPlugin } from "@stackflow/react";
import { useMemo } from "react";
import { AppScreenPropsProvider, NextAppScreenPropsProvider } from "./components";
import { GlobalInteraction, NextScreenRegistryProvider, type NextSwipeBackArea } from "./primitive";

export interface SeedPluginOptions {
  theme: "android" | "cupertino";

  /**
   * Stack-wide default for `NextAppScreen`'s swipe-back area, for apps that
   * pick it per platform rather than per screen. A screen's own
   * `swipeBackArea` still wins.
   *
   * @default "edge"
   */
  swipeBackArea?: NextSwipeBackArea;

  /**
   * Stack-wide corner radius of the device display, matched by the clip
   * `NextAppScreen` runs while a transition or a swipe-back gesture is in
   * flight. A number means px; a string is any CSS length. A screen's own
   * `clipRadius` still wins, and unset means nothing is clipped.
   *
   * The web has no way to read the display's own radius, so pass what the host
   * knows — on iOS that is `UIScreen._displayCornerRadius` (55.0pt on iPhone 15
   * Pro), and an iOS point maps 1:1 to a CSS px.
   */
  clipRadius?: string | number;
}

export const seedPlugin =
  (
    options:
      | SeedPluginOptions
      // biome-ignore lint/suspicious/noExplicitAny: matches upstream @stackflow/react's `initialContext: any`
      | ((args: { initialContext?: any }) => SeedPluginOptions),
  ): StackflowReactPlugin =>
  () => ({
    key: "seed-design",
    wrapStack({ stack, initialContext }) {
      const resolved = typeof options === "function" ? options({ initialContext }) : options;

      return <SeedProviders options={resolved}>{stack.render()}</SeedProviders>;
    },
  });

function SeedProviders({
  options,
  children,
}: {
  options: SeedPluginOptions;
  children: React.ReactNode;
}) {
  const { theme, swipeBackArea, clipRadius } = options;

  // The legacy AppScreen has neither of the NextAppScreen props, and any prop
  // it doesn't recognize lands on the DOM.
  const appScreenProps = useMemo(() => ({ theme }), [theme]);
  const nextAppScreenProps = useMemo(
    () => ({ theme, swipeBackArea, clipRadius }),
    [theme, swipeBackArea, clipRadius],
  );

  return (
    <AppScreenPropsProvider value={appScreenProps}>
      <NextAppScreenPropsProvider value={nextAppScreenProps}>
        <NextScreenRegistryProvider>
          <GlobalInteraction>{children}</GlobalInteraction>
        </NextScreenRegistryProvider>
      </NextAppScreenPropsProvider>
    </AppScreenPropsProvider>
  );
}
