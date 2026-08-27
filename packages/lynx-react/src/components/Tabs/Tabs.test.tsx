import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import * as Tabs from "./Tabs.namespace";

function BasicTabs(props: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}) {
  return (
    <Tabs.Root {...props}>
      <Tabs.List>
        <Tabs.Trigger value="one">첫 번째</Tabs.Trigger>
        <Tabs.Trigger value="two">두 번째</Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Content value="one">첫 번째 콘텐츠</Tabs.Content>
      <Tabs.Content value="two">두 번째 콘텐츠</Tabs.Content>
    </Tabs.Root>
  );
}

function getTrigger(container: HTMLElement, label: string) {
  const trigger = Array.from(container.querySelectorAll<HTMLElement>(".seed-tabs__trigger")).find(
    (element) => element.textContent === label,
  );
  if (!trigger) throw new Error(`Expected trigger for ${label} to exist.`);
  return trigger;
}

describe("Tabs", () => {
  it("renders triggers inside the list content layout container", () => {
    const { container } = render(<BasicTabs defaultValue="one" />);
    const list = container.querySelector(".seed-tabs__list");
    const listContent = list?.querySelector(":scope > .seed-tabs__listContent");

    expect(listContent).not.toBeNull();
    expect(listContent?.querySelectorAll(".seed-tabs__trigger")).toHaveLength(2);
  });

  it("changes an uncontrolled value when a trigger is tapped", () => {
    const onValueChange = vi.fn();
    const { container } = render(<BasicTabs defaultValue="one" onValueChange={onValueChange} />);

    const first = getTrigger(container, "첫 번째");
    const second = getTrigger(container, "두 번째");

    expect(first).toHaveAttribute("accessibility-value", "selected");
    expect(second).toHaveAttribute("accessibility-value", "not selected");

    fireEvent.tap(second);

    expect(onValueChange).toHaveBeenCalledWith("two");
    expect(second).toHaveAttribute("accessibility-value", "selected");
  });

  it("does not select a disabled trigger", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <Tabs.Root defaultValue="one" onValueChange={onValueChange}>
        <Tabs.List>
          <Tabs.Trigger value="one">첫 번째</Tabs.Trigger>
          <Tabs.Trigger value="two" disabled>
            두 번째
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>,
    );

    const disabled = getTrigger(container, "두 번째");
    fireEvent.tap(disabled);

    expect(onValueChange).not.toHaveBeenCalled();
    expect(disabled).toHaveAttribute("accessibility-traits", "disabled");
  });

  it("keeps controlled selection until the value prop changes", () => {
    const onValueChange = vi.fn();
    const { container, rerender } = render(<BasicTabs value="one" onValueChange={onValueChange} />);

    const second = getTrigger(container, "두 번째");
    fireEvent.tap(second);

    expect(onValueChange).toHaveBeenCalledWith("two");
    expect(second).toHaveAttribute("accessibility-value", "not selected");

    rerender(<BasicTabs value="two" onValueChange={onValueChange} />);
    expect(second).toHaveAttribute("accessibility-value", "selected");
  });

  it("keeps carousel contents as views without a carousel camera", () => {
    const { container } = render(
      <Tabs.Root defaultValue="one">
        <Tabs.List>
          <Tabs.Trigger value="one">첫 번째</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Carousel>
          <Tabs.Content value="one">첫 번째 콘텐츠</Tabs.Content>
        </Tabs.Carousel>
      </Tabs.Root>,
    );

    expect(container.querySelector("viewpager-item")).toBeNull();
    expect(container.querySelector(".seed-tabs__content")).not.toBeNull();
  });

  it("renders carousel camera contents as native viewpager items", () => {
    const { container } = render(
      <Tabs.Root defaultValue="one">
        <Tabs.List>
          <Tabs.Trigger value="one">첫 번째</Tabs.Trigger>
          <Tabs.Trigger value="two">두 번째</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Carousel swipeable>
          <Tabs.CarouselCamera>
            <Tabs.Content value="one">첫 번째 콘텐츠</Tabs.Content>
            <Tabs.Content value="two">두 번째 콘텐츠</Tabs.Content>
          </Tabs.CarouselCamera>
        </Tabs.Carousel>
      </Tabs.Root>,
    );

    const pager = container.querySelector("viewpager");
    expect(pager).not.toBeNull();
    expect(pager?.querySelectorAll("viewpager-item")).toHaveLength(2);
    expect(pager).toHaveAttribute("enable-scroll");
  });

  it("maps pager indexes from content order when a disabled trigger has no content", () => {
    const { container } = render(
      <Tabs.Root defaultValue="two">
        <Tabs.List>
          <Tabs.Trigger value="one">첫 번째</Tabs.Trigger>
          <Tabs.Trigger value="disabled" disabled>
            비활성
          </Tabs.Trigger>
          <Tabs.Trigger value="two">두 번째</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Carousel swipeable>
          <Tabs.CarouselCamera>
            <Tabs.Content value="one">첫 번째 콘텐츠</Tabs.Content>
            <Tabs.Content value="two">두 번째 콘텐츠</Tabs.Content>
          </Tabs.CarouselCamera>
        </Tabs.Carousel>
      </Tabs.Root>,
    );

    const pager = container.querySelector("viewpager");
    expect(pager).toHaveAttribute("initial-select-index", "1");
    expect(getTrigger(container, "두 번째")).toHaveAttribute("accessibility-value", "selected");
  });

  it("exposes tab semantics through Lynx accessibility attributes", () => {
    const { container } = render(<BasicTabs defaultValue="one" />);
    const first = getTrigger(container, "첫 번째");

    expect(first).toHaveAttribute("accessibility-role-description", "tab");
    expect(first).toHaveAttribute("accessibility-label", "첫 번째");
    expect(first).toHaveAttribute("accessibility-traits", "selected");
  });
});
