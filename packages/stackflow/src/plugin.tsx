import type { StackflowReactPlugin } from "@stackflow/react";
import { useMemo } from "react";
import { AppScreenPropsProvider, NextAppScreenPropsProvider } from "./components";
import { NextAppBarPropsProvider } from "./components/NextAppBar/NextAppBar";
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
  const { theme, swipeBackArea } = options;

  // The legacy AppScreen has neither of the NextAppScreen props, and any prop
  // it doesn't recognize lands on the DOM.
  const themeProps = useMemo(() => ({ theme }), [theme]);
  const nextAppScreenProps = useMemo(() => ({ swipeBackArea }), [swipeBackArea]);

  return (
    <AppScreenPropsProvider value={themeProps}>
      <NextAppScreenPropsProvider value={nextAppScreenProps}>
        <NextAppBarPropsProvider value={themeProps}>
          <NextScreenRegistryProvider>
            <GlobalInteraction>{children}</GlobalInteraction>
          </NextScreenRegistryProvider>
        </NextAppBarPropsProvider>
      </NextAppScreenPropsProvider>
    </AppScreenPropsProvider>
  );
}
