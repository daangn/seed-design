import "@testing-library/jest-dom";
import { fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import * as SegmentedControl from "./SegmentedControl.namespace";

function BasicSegmentedControl(props: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}) {
  return (
    <SegmentedControl.Root {...props} accessibility-label="정렬 기준">
      <SegmentedControl.Item value="hot">인기순</SegmentedControl.Item>
      <SegmentedControl.Item value="new">최신순</SegmentedControl.Item>
      <SegmentedControl.Indicator />
    </SegmentedControl.Root>
  );
}

function getItem(container: HTMLElement, label: string) {
  const item = Array.from(
    container.querySelectorAll<HTMLElement>(".seed-segmented-control__item"),
  ).find((element) => element.textContent === label);
  if (!item) throw new Error(`Expected item for ${label} to exist.`);
  return item;
}

describe("SegmentedControl", () => {
  it("changes an uncontrolled value when an item is tapped", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <BasicSegmentedControl defaultValue="hot" onValueChange={onValueChange} />,
    );
    const hot = getItem(container, "인기순");
    const latest = getItem(container, "최신순");

    expect(hot).toHaveAttribute("accessibility-value", "selected");
    expect(latest).toHaveAttribute("accessibility-value", "not selected");

    fireEvent.tap(latest);

    expect(onValueChange).toHaveBeenCalledWith("new");
    expect(latest).toHaveAttribute("accessibility-value", "selected");
  });

  it("does not select a disabled item", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <SegmentedControl.Root defaultValue="hot" onValueChange={onValueChange}>
        <SegmentedControl.Item value="hot">인기순</SegmentedControl.Item>
        <SegmentedControl.Item value="new" disabled>
          최신순
        </SegmentedControl.Item>
      </SegmentedControl.Root>,
    );
    const disabledItem = getItem(container, "최신순");

    fireEvent.tap(disabledItem);

    expect(onValueChange).not.toHaveBeenCalled();
    expect(disabledItem).toHaveAttribute("accessibility-traits", "disabled");
  });

  it("keeps the press-start selection when main-thread feedback hands off to selection", async () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <BasicSegmentedControl defaultValue="hot" onValueChange={onValueChange} />,
      {
        enableMainThread: true,
        enableBackgroundThread: true,
      },
    );
    await waitSchedule();
    const latest = getItem(container, "최신순");
    const getBackground = () =>
      latest.querySelector<HTMLElement>(".seed-segmented-control__itemBackground");

    fireEvent.touchstart(latest, {});
    await waitSchedule();
    expect(getBackground()).toHaveClass("seed-segmented-control__itemBackground--pressed_true");
    expect(getBackground()).toHaveClass("seed-segmented-control__itemBackground--selected_false");

    fireEvent.touchend(latest, {});
    await waitSchedule();
    fireEvent.tap(latest);
    await waitSchedule();

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith("new");
    expect(getBackground()).toHaveClass("seed-segmented-control__itemBackground--pressed_false");
    expect(getBackground()).toHaveClass("seed-segmented-control__itemBackground--selected_false");
  });
});
