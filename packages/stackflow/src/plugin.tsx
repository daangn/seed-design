import type { StackflowReactPlugin } from "@stackflow/react";
import { AppScreenPropsProvider } from "./components";
import { GlobalInteraction } from "./primitive";

export interface SeedPluginOptions {
  theme: "android" | "cupertino";
}

export const seedPlugin =
  (options: SeedPluginOptions): StackflowReactPlugin =>
  () => ({
    key: "seed-design",
    wrapStack({ stack }) {
      return (
        <AppScreenPropsProvider value={options}>
          <GlobalInteraction>{stack.render()}</GlobalInteraction>
        </AppScreenPropsProvider>
      );
    },
  });
