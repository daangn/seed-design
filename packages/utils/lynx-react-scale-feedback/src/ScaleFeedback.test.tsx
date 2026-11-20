import { createRef } from "@lynx-js/react";
import { fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PreferredMotionContext, type PreferredMotion } from "./PreferredMotionContext";
import { ScaleFeedback } from "./ScaleFeedback";

beforeEach(() => {
  const mainThread = lynxTestingEnv.mainThread.globalThis;
  const systemInfo = mainThread["SystemInfo"];
  const getComputedStyle = mainThread["__GetComputedStyleByKey"];
  mainThread["SystemInfo"] = { ...systemInfo, lynxSdkVersion: "3.6" };
  // 0.117.0의 테스트 런타임에는 Main Thread의 computed-style 브리지가 없습니다.
  mainThread["__GetComputedStyleByKey"] = (element: HTMLElement, property: string) =>
    element.style.getPropertyValue(property);
  return () => {
    mainThread["SystemInfo"] = systemInfo;
    mainThread["__GetComputedStyleByKey"] = getComputedStyle;
  };
});

function Example({
  disabled,
  preferredMotion,
  onTouchStart,
}: {
  disabled?: boolean;
  preferredMotion?: PreferredMotion;
  onTouchStart?: () => void;
}) {
  return (
    <PreferredMotionContext.Provider value={preferredMotion}>
      <ScaleFeedback disabled={disabled} onTouchStart={onTouchStart}>
        <view />
      </ScaleFeedback>
    </PreferredMotionContext.Provider>
  );
}

async function renderTarget(props: Parameters<typeof Example>[0] = {}) {
  const view = render(<Example {...props} />, {
    enableMainThread: true,
    enableBackgroundThread: true,
  });
  await waitSchedule();
  const target = view.container.children[0] as HTMLElement;
  // touchstart에서 layout 측정이 없으면 computed width·height로 scale을 계산합니다.
  target.style.width = "40px";
  target.style.height = "40px";
  return { ...view, target };
}

function lastScale() {
  const animations = [...elementTree.animationMap.values()];
  return animations.at(-1)?.keyframes.at(-1)?.transform;
}

describe("ScaleFeedback", () => {
  it("forwards the consumer ref and clears it on unmount", async () => {
    const ref = createRef<unknown>();
    const { unmount } = render(
      <ScaleFeedback ref={ref}>
        <view />
      </ScaleFeedback>,
      { enableMainThread: true, enableBackgroundThread: true },
    );
    await waitSchedule();

    expect(ref.current).toBeTruthy();
    unmount();
    await waitSchedule();
    expect(ref.current).toBeNull();
  });

  it.each([
    "touchend",
    "touchcancel",
  ] as const)("scales down on touchstart and back on %s", async (finish) => {
    const { target } = await renderTarget();

    fireEvent.touchstart(target, {});
    await waitSchedule();
    expect(lastScale()).toBe("scale(0.95)");

    fireEvent[finish](target, {});
    await waitSchedule();
    expect(lastScale()).toBe("scale(1)");
  });

  it.each([
    { name: "disabled", props: { disabled: true } },
    { name: "reduced motion", props: { preferredMotion: "reduced" as const } },
  ])("does not scale while $name but still reports the touch", async ({ props }) => {
    const onTouchStart = vi.fn();
    const { target } = await renderTarget({ ...props, onTouchStart });

    fireEvent.touchstart(target, {});
    await waitSchedule();

    expect(lastScale()).toBeUndefined();
    expect(onTouchStart).toHaveBeenCalledTimes(1);
  });

  it("restores the scale immediately when disabled during a press", async () => {
    const { target, rerender } = await renderTarget();

    fireEvent.touchstart(target, {});
    await waitSchedule();
    expect(lastScale()).toBe("scale(0.95)");

    rerender(<Example disabled />);
    await waitSchedule();

    const animation = [...elementTree.animationMap.values()].at(-1);
    expect(animation?.keyframes.at(-1)?.transform).toBe("scale(1)");
    expect(animation?.options).toMatchObject({ duration: 0 });
  });
});
