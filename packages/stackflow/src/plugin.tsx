import type { StackflowReactPlugin } from "@stackflow/react";
import { AppScreenPropsProvider } from "./components";
import { GlobalInteraction } from "./primitive";

export interface SeedPluginOptions {
  theme: "android" | "cupertino";
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

      return (
        <AppScreenPropsProvider value={resolved}>
          <GlobalInteraction>{stack.render()}</GlobalInteraction>
        </AppScreenPropsProvider>
      );
    },
  });
