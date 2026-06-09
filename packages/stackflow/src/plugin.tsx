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
    onBeforePop({ actionParams, actions }) {
      // pop(count)의 내부 반복과 animate:false 는 skipExitActiveState: true 로 들어온다.
      // 이들은 애니메이션 없이 즉시 제거되므로 절대 막지 않는다.
      if (actionParams.skipExitActiveState) {
        return;
      }

      // 이미 애니메이션되는 pop(exit-active)이 진행 중이면, 중복으로 들어온 pop을 버린다.
      // "동시에 exit-active 인 Activity 는 최대 1개" 불변식을 유지한다.
      const isPopping = actions
        .getStack()
        .activities.some((activity) => activity.transitionState === "exit-active");

      if (isPopping) {
        actions.preventDefault();
      }
    },
    wrapStack({ stack, initialContext }) {
      const resolved = typeof options === "function" ? options({ initialContext }) : options;

      return (
        <AppScreenPropsProvider value={resolved}>
          <GlobalInteraction>{stack.render()}</GlobalInteraction>
        </AppScreenPropsProvider>
      );
    },
  });
