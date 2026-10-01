import "@testing-library/jest-dom";
import { fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import type * as LynxUiCommon from "@lynx-js/lynx-ui-common";

import * as Slider from "./Slider.namespace";

vi.mock("@lynx-js/lynx-ui-common", async (importOriginal) => {
  const actual = await importOriginal<typeof LynxUiCommon>();
  return {
    ...actual,
    getRectByRef: vi.fn(() => Promise.resolve({ left: 10, width: 100 })),
  };
});

// 값·drag·측정 동작은 @seed-design/lynx-react-slider에서 검증한다. 여기서는 recipe 조립을 확인한다.
describe("Slider", () => {
  it("renders recipe slots with thumb accessibility and indicator labels", () => {
    const { container } = render(
      <Slider.Root defaultValues={[40]} getAccessibilityLabel={(index) => `Price ${index + 1}`}>
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.ValueIndicatorRoot thumbIndex={0}>
            <Slider.ValueIndicatorLabel thumbIndex={0} />
          </Slider.ValueIndicatorRoot>
          <Slider.Thumb thumbIndex={0} />
        </Slider.Control>
      </Slider.Root>,
    );
    const thumb = container.querySelector(".seed-slider__thumb");
    expect(container.querySelector(".seed-slider__valueIndicatorMotion")).toContainElement(
      container.querySelector(".seed-slider__valueIndicatorRoot") as HTMLElement,
    );
    expect(thumb).toHaveAttribute("accessibility-label", "Price 1");
    expect(thumb).toHaveAttribute("accessibility-value", "minimum 0, maximum 100, current 40");
    expect(container.querySelector("text")).toHaveTextContent("40");
  });

  it("renders string and number marker labels as styled text elements", () => {
    const { container } = render(
      <Slider.Root defaultValues={[40]}>
        <Slider.Markers>
          <Slider.Marker value={0}>0°C</Slider.Marker>
          <Slider.Marker value={100}>{100}</Slider.Marker>
        </Slider.Markers>
      </Slider.Root>,
    );
    const labels = Array.from(
      container.querySelectorAll("text.seed-slider-marker"),
      (text) => text.textContent,
    );
    expect(labels).toEqual(["0°C", "100"]);
  });

  it("commits a drag on the styled root once at touch end", async () => {
    const onValuesCommit = vi.fn();
    const view = render(
      <Slider.Root values={[20]} onValuesCommit={onValuesCommit}>
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumb thumbIndex={0} />
        </Slider.Control>
      </Slider.Root>,
    );
    await waitSchedule();
    const root = view.container.querySelector(".seed-slider__root");
    if (!root) throw new Error("Expected slider root");
    fireEvent.touchstart(root, { eventType: "catchEvent", touches: [{ pageX: 60 }] });
    await waitSchedule();
    fireEvent.touchmove(root, { eventType: "catchEvent", touches: [{ pageX: 80 }] });
    fireEvent.touchend(root, { eventType: "catchEvent", changedTouches: [{ pageX: 80 }] });
    await waitSchedule();
    expect(onValuesCommit).toHaveBeenCalledTimes(1);
    expect(onValuesCommit).toHaveBeenLastCalledWith([70]);
  });

  it("marks a disabled thumb and ignores touches", () => {
    const onValuesChange = vi.fn();
    const { container } = render(
      <Slider.Root defaultValues={[20]} disabled onValuesChange={onValuesChange}>
        <Slider.Control>
          <Slider.Thumb thumbIndex={0} accessibility-traits="button" />
        </Slider.Control>
      </Slider.Root>,
    );
    const root = container.querySelector(".seed-slider__root");
    if (!root) throw new Error("Expected slider root");
    fireEvent.touchstart(root, { eventType: "catchEvent", touches: [{ pageX: 80 }] });
    fireEvent.touchend(root, { eventType: "catchEvent", changedTouches: [{ pageX: 80 }] });
    expect(onValuesChange).not.toHaveBeenCalled();
    expect(container.querySelector(".seed-slider__thumb")).toHaveAttribute(
      "accessibility-traits",
      "disabled",
    );
  });
});
