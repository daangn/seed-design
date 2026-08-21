import * as React from "@lynx-js/react";
import { act, render, waitSchedule } from "@lynx-js/react/testing-library";
import type { MainThread } from "@lynx-js/types";
import { describe, expect, it } from "vitest";

import type { LynxIconElementProps } from "../../types";
import { InternalIcon } from "./Icon";

const TestIcon = React.forwardRef<
  MainThread.Element,
  LynxIconElementProps & { children?: React.ReactNode }
>((props, ref) => {
  const { children, ...nativeProps } = props;

  return (
    <image {...nativeProps} {...(ref ? { "main-thread:ref": ref } : {})}>
      {children}
    </image>
  );
});
TestIcon.displayName = "TestIcon";

function getSourceAndImage() {
  const source = elementTree.root?.querySelector<HTMLElement>("view");
  const image = source?.querySelector<HTMLElement>("image");

  if (!source || !image) {
    throw new Error("Expected icon source and image elements to exist.");
  }

  return { source, image };
}

function installMainThreadStyleMocks(getComputedColor: () => string) {
  let nextFrameId = 1;
  const frames = new Map<number, FrameRequestCallback>();

  lynxTestingEnv.mainThread.globalThis["SystemInfo"] = {
    ...SystemInfo,
    lynxSdkVersion: "3.5",
  };
  lynxTestingEnv.mainThread.globalThis["__GetComputedStyleByKey"] = getComputedColor;
  lynxTestingEnv.mainThread.globalThis["requestAnimationFrame"] = (
    callback: FrameRequestCallback,
  ) => {
    const frameId = nextFrameId;
    nextFrameId += 1;
    frames.set(frameId, callback);
    return frameId;
  };
  lynxTestingEnv.mainThread.globalThis["cancelAnimationFrame"] = (frameId: number) => {
    frames.delete(frameId);
  };

  const runNextFrame = (timestamp = 16) => {
    const nextFrame = frames.entries().next().value;
    if (!nextFrame) {
      throw new Error("Expected a scheduled animation frame.");
    }

    const [frameId, callback] = nextFrame;
    frames.delete(frameId);
    lynxTestingEnv.switchToMainThread();
    act(() => {
      callback(timestamp);
    });
    lynxTestingEnv.switchToBackgroundThread();
  };

  return { frames, runNextFrame };
}

describe("InternalIcon", () => {
  it("reads the updated computed color in the next frame", async () => {
    let computedColor = "rgb(134, 139, 148)";
    const { frames, runNextFrame } = installMainThreadStyleMocks(() => computedColor);

    const renderIcon = (dependency: string) => (
      <InternalIcon icon={<TestIcon />} className={dependency} deps={[dependency]} />
    );
    const { rerender } = render(renderIcon("unchecked"), {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
    await waitSchedule();

    const { image } = getSourceAndImage();
    expect(frames.size).toBe(1);
    runNextFrame();

    expect(image.getAttribute("tint-color")).toBe("rgb(134, 139, 148)");

    rerender(renderIcon("checked"));
    await waitSchedule();

    expect(frames.size).toBe(1);
    expect(image.getAttribute("tint-color")).toBe("rgb(134, 139, 148)");

    computedColor = "rgb(255, 102, 0)";
    runNextFrame();

    expect(image.getAttribute("tint-color")).toBe("rgb(255, 102, 0)");
  });

  it("coalesces pending frame syncs across rapid dependency changes", async () => {
    let computedColor = "rgb(134, 139, 148)";
    const { frames, runNextFrame } = installMainThreadStyleMocks(() => computedColor);
    const renderIcon = (dependency: string) => (
      <InternalIcon icon={<TestIcon />} className={dependency} deps={[dependency]} />
    );
    const { rerender } = render(renderIcon("unchecked"), {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
    await waitSchedule();

    rerender(renderIcon("checked"));
    await waitSchedule();
    rerender(renderIcon("unchecked-again"));
    await waitSchedule();

    expect(frames.size).toBe(1);

    computedColor = "rgb(73, 80, 88)";
    runNextFrame();

    expect(getSourceAndImage().image.getAttribute("tint-color")).toBe("rgb(73, 80, 88)");
  });
});
