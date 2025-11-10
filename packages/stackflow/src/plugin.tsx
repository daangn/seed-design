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

    onChanged: ({ actions }) => {
      if (typeof window === "undefined") return;

      const activeActivity = actions.getStack().activities.find((activity) => activity.isActive);

      // this logic is from useZIndexBase (@stackflow/react-ui-core)
      const activeZIndexBase = activeActivity ? activeActivity.zIndex * 5 : 0;

      document.body.style.setProperty("--active-z-index-base", `${activeZIndexBase}`);
    },

    wrapStack: ({ stack }) => {
      return (
        <AppScreenPropsProvider value={options}>
          <GlobalInteraction>{stack.render()}</GlobalInteraction>
        </AppScreenPropsProvider>
      );
    },
  });
