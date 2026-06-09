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
      // 이미 즉시 제거이므로 그대로 통과시킨다.
      if (actionParams.skipExitActiveState) {
        return;
      }

      // 이미 애니메이션되는 pop(exit-active)이 진행 중이면, 이번 pop을 "즉시 제거"로 강등한다.
      // 화면은 그대로 닫히지만(개수 유지) exit 애니메이션이 겹치지 않아, 동시에 애니메이션되는
      // exit는 항상 1개로 유지된다. 결과적으로 pop(); pop(); 가 pop(2)와 동일하게 동작하고,
      // @stackflow/plugin-basic-ui 와 닫히는 화면 수가 일치한다.
      const isPopping = actions
        .getStack()
        .activities.some((activity) => activity.transitionState === "exit-active");

      if (isPopping) {
        actions.overrideActionParams({ skipExitActiveState: true });
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
