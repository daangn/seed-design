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
      // pop(count)의 내부 반복(2번째+)과 animate:false 는 skipExitActiveState: true 로 들어온다 → 통과.
      if (actionParams.skipExitActiveState) {
        return;
      }

      // 이미 exit 전환이 진행 중이면, 새로 들어온 pop은 무시한다 ("전환당 1회").
      // 백버튼 연타·중복 호출 등 어느 UI에서 온 동시 pop이든 호출부와 무관하게 막는다.
      // 여러 화면을 한 번에 닫으려면 pop(count) 를 사용한다.
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
