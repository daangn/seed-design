import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";

import * as SegmentedControl from "./SegmentedControl.namespace";
import { AccessibilityElementScope } from "../../utils/accessibility";

afterEach(() => {
  vi.restoreAllMocks();
});

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
  it("keeps item defaults inside a scope without warning", () => {
    const warn = vi.spyOn(console, "warn");
    const { container } = render(
      <AccessibilityElementScope>
        <SegmentedControl.Root defaultValue="hot">
          <SegmentedControl.Item value="hot">{""}</SegmentedControl.Item>
          <SegmentedControl.Item value="new" accessibility-element>
            최신순
          </SegmentedControl.Item>
        </SegmentedControl.Root>
      </AccessibilityElementScope>,
    );
    const items = container.querySelectorAll(".seed-segmented-control__item");
    expect(items[0]).toHaveAttribute("accessibility-element", "true");
    expect(items[1]).toHaveAttribute("accessibility-element", "true");
    expect(
      warn.mock.calls.filter(
        ([message]) => typeof message === "string" && message.startsWith("SegmentedControlItem:"),
      ),
    ).toHaveLength(0);
  });

  it("exposes item names and selection without duplicate label text", () => {
    const { container } = render(<BasicSegmentedControl defaultValue="hot" />);
    const hot = getItem(container, "인기순");
    expect(hot).toHaveAttribute("accessibility-label", "인기순");
    expect(hot).toHaveAttribute("accessibility-value", "selected");
    expect(hot).toHaveAttribute("flatten", "false");
    expect(hot).toHaveAttribute("accessibility-element", "true");
    const label = hot.querySelector(".seed-segmented-control__label");
    expect(label).toHaveAttribute("accessibility-element", "false");
    expect(label).toHaveAttribute("accessibility-elements-hidden", "true");
  });

  it("preserves native item accessibility overrides", () => {
    const { container } = render(
      <SegmentedControl.Root defaultValue="hot">
        <SegmentedControl.Item
          value="hot"
          flatten
          accessibility-label="다른 이름"
          accessibility-element={false}
          accessibility-value="사용자 값"
        >
          인기순
        </SegmentedControl.Item>
      </SegmentedControl.Root>,
    );
    const hot = getItem(container, "인기순");
    expect(hot).toHaveAttribute("flatten", "true");
    expect(hot).toHaveAttribute("accessibility-label", "다른 이름");
    expect(hot).toHaveAttribute("accessibility-element", "false");
    expect(hot).toHaveAttribute("accessibility-value", "사용자 값");
  });

  it("warns only for unnamed item accessibility elements", () => {
    const warn = vi.spyOn(console, "warn");
    function Subject({ accessible }: { accessible: boolean }) {
      return (
        <SegmentedControl.Root defaultValue="hot">
          <SegmentedControl.Item value="hot" accessibility-element={accessible}>
            {""}
          </SegmentedControl.Item>
        </SegmentedControl.Root>
      );
    }
    const { rerender } = render(<Subject accessible={false} />);
    expect(
      warn.mock.calls.filter(
        ([message]) => typeof message === "string" && message.startsWith("SegmentedControlItem:"),
      ),
    ).toHaveLength(0);
    rerender(<Subject accessible />);
    expect(
      warn.mock.calls.filter(
        ([message]) => typeof message === "string" && message.startsWith("SegmentedControlItem:"),
      ).length,
    ).toBeGreaterThan(0);
  });

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
});
