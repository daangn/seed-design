import type * as LynxUiCommon from "@lynx-js/lynx-ui-common";
import { createEvent, fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { measureCommits, usesPreact10 } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it, vi } from "vitest";

import * as Slider from "./Slider.namespace";

// Slider.test.tsx와 같이 track 측정에 고정 rect를 돌려준다.
vi.mock("@lynx-js/lynx-ui-common", async (importOriginal) => ({
  ...(await importOriginal<typeof LynxUiCommon>()),
  getRectByRef: vi.fn(() => Promise.resolve({ left: 10, width: 100 })),
}));

function Example() {
  return (
    <Slider.Root defaultValues={[20]} getAccessibilityLabel={() => "가격"}>
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.ValueIndicatorRoot thumbIndex={0}>
          <Slider.ValueIndicatorLabel thumbIndex={0} />
        </Slider.ValueIndicatorRoot>
        <Slider.Thumb thumbIndex={0} />
      </Slider.Control>
    </Slider.Root>
  );
}

// 빈 화면을 hydrate한 뒤 mount해야 mount commit이 hydration에 합쳐지지 않는다.
async function mount() {
  const view = render(<view />, { enableMainThread: true, enableBackgroundThread: true });
  const commits = await measureCommits(() => view.rerender(<Example />));
  return { view, commits };
}

describe("Slider commits", () => {
  // mount 뒤 root·thumb 측정 결과로 track 폭을 한 번 반영한다(lynx-react-headless/slider/src/useSlider.ts).
  it("commits the track measurement on mount", async () => {
    const { commits } = await mount();
    expect(commits).toMatchObject(
      usesPreact10 ? { total: 8, nonEmpty: 2 } : { total: 2, nonEmpty: 2 },
    );
  });

  it("does not commit when the root width is reported again", async () => {
    const { view } = await mount();
    const root = view.container.querySelector(".seed-slider__root");
    if (!root) throw new Error("Missing slider");
    const commits = await measureCommits(() => {
      const init = { eventType: "bindEvent", eventName: "layoutchange", detail: { width: 100 } };
      const event = createEvent("bindEvent:layoutchange", root, init);
      Object.assign(event, init);
      fireEvent(root, event);
    });
    expect(commits).toMatchObject({ total: 0, nonEmpty: 0 });
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    const { view } = await mount();
    const commits = await measureCommits(() => view.rerender(<Example />));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });

  it("commits one drag frame", async () => {
    const { view } = await mount();
    const root = view.container.querySelector(".seed-slider__root");
    const thumb = view.container.querySelector(".seed-slider__thumb");
    if (!root || !thumb) throw new Error("Missing slider");
    fireEvent.touchstart(root, { eventType: "catchEvent", touches: [{ pageX: 30 }] });
    await waitSchedule();
    const commits = await measureCommits(() =>
      fireEvent.touchmove(root, { eventType: "catchEvent", touches: [{ pageX: 60 }] }),
    );
    expect(thumb.getAttribute("accessibility-value")).toBe("minimum 0, maximum 100, current 50");
    expect(commits).toMatchObject(
      usesPreact10 ? { total: 7, nonEmpty: 4 } : { total: 1, nonEmpty: 1 },
    );
  });
});
