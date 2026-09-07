import "@testing-library/jest-dom";
import { act, fireEvent, render } from "@lynx-js/react/testing-library";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type * as ReactModule from "@lynx-js/react";
import type { ReactNode } from "@lynx-js/react";
import type {
  PopoverBackdropProps,
  PopoverContentProps,
  PopoverPositionerProps,
  PopoverRootProps,
  PopoverTriggerProps,
} from "@lynx-js/lynx-ui-popover";
import type { LynxPressableProps } from "../../types";

const popoverMocks = vi.hoisted(() => ({
  positionerProps: [] as PopoverPositionerProps[],
}));

vi.mock("@lynx-js/lynx-ui-popover", async () => {
  const React = await vi.importActual<typeof ReactModule>("@lynx-js/react");

  interface PopoverState {
    onVisibleChange?: (visible: boolean) => void;
    show: boolean;
  }

  const PopoverStateContext = React.createContext<PopoverState>({ show: false });

  function PopoverRoot({ children, show = false, onVisibleChange }: PopoverRootProps) {
    return (
      <PopoverStateContext.Provider value={{ show, onVisibleChange }}>
        {children}
      </PopoverStateContext.Provider>
    );
  }

  function PopoverTrigger({ children, disabled, onClick }: PopoverTriggerProps) {
    const { show, onVisibleChange } = React.useContext(PopoverStateContext);
    const handlers: Pick<LynxPressableProps, "bindtap"> = {
      bindtap: () => {
        if (disabled) return;
        onVisibleChange?.(!show);
        onClick?.();
      },
    };

    return (
      <view {...handlers} className="test-popover-trigger">
        {children}
      </view>
    );
  }

  function PopoverBackdrop({ onClick }: PopoverBackdropProps) {
    const { onVisibleChange } = React.useContext(PopoverStateContext);
    const handlers: Pick<LynxPressableProps, "bindtap"> = {
      bindtap: () => {
        onVisibleChange?.(false);
        onClick?.();
      },
    };

    return <view {...handlers} className="test-popover-backdrop" />;
  }

  function PopoverPositioner({ children, ...props }: PopoverPositionerProps) {
    const { show } = React.useContext(PopoverStateContext);
    popoverMocks.positionerProps.push({ children, ...props });

    return show ? children : null;
  }

  function PopoverContent({ children }: PopoverContentProps) {
    return <>{children}</>;
  }

  return { PopoverBackdrop, PopoverContent, PopoverPositioner, PopoverRoot, PopoverTrigger };
});

import * as Select from "./Select.namespace";

const options = [
  { value: "first", textValue: "첫 번째" },
  { value: "second", textValue: "두 번째" },
] as const;

function BasicSelect(props: {
  children?: ReactNode;
  defaultOpen?: boolean;
  defaultValue?: string[];
  disabled?: boolean;
  formatValue?: (options: Select.Option[]) => ReactNode;
  multiple?: boolean;
  onOpenChange?: (open: boolean) => void;
  onValueChange?: (value: string[]) => void;
  open?: boolean;
  positionerStyle?: PopoverPositionerProps["style"];
  options?: typeof options;
  readOnly?: boolean;
  value?: string[];
}) {
  const { options: selectOptions = options, positionerStyle, ...rootProps } = props;
  return (
    <Select.Root {...rootProps} options={selectOptions}>
      <Select.Trigger className="test-select-trigger">
        <Select.Value />
        <Select.Placeholder>선택하세요</Select.Placeholder>
        <Select.SuffixIcon />
      </Select.Trigger>
      <Select.Positioner style={positionerStyle}>
        <Select.Content>
          <Select.ScrollArea>
            <Select.Item value="first">
              <Select.ItemBody>
                <Select.ItemLabel />
              </Select.ItemBody>
              <Select.ItemIndicator>
                <text>선택됨</text>
              </Select.ItemIndicator>
            </Select.Item>
            <Select.Item value="second">
              <Select.ItemBody>
                <Select.ItemLabel />
              </Select.ItemBody>
              <Select.ItemIndicator>
                <text>선택됨</text>
              </Select.ItemIndicator>
            </Select.Item>
          </Select.ScrollArea>
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
}

function getPopoverTrigger(container: HTMLElement) {
  const trigger = container.querySelector<HTMLElement>(".test-popover-trigger");
  if (!trigger) throw new Error("Expected PopoverTrigger to exist.");
  return trigger;
}

function getPopoverBackdrop(container: HTMLElement) {
  const backdrop = container.querySelector<HTMLElement>(".test-popover-backdrop");
  if (!backdrop) throw new Error("Expected PopoverBackdrop to exist.");
  return backdrop;
}

function getItem(container: HTMLElement, label: string) {
  const item = Array.from(
    container.querySelectorAll<HTMLElement>('[accessibility-role-description="option"]'),
  ).find((element) => element.getAttribute("accessibility-label") === label);
  if (!item) throw new Error(`Expected Select item ${label} to exist.`);
  return item;
}
describe("Select", () => {
  beforeEach(() => {
    popoverMocks.positionerProps = [];
  });

  it("opens through the Popover trigger and forwards the open change", () => {
    const onOpenChange = vi.fn();
    const { container } = render(<BasicSelect onOpenChange={onOpenChange} />);

    fireEvent.tap(getPopoverTrigger(container));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(container).toHaveTextContent("첫 번째");

    const scrollArea = container.querySelector("scroll-view");

    expect(scrollArea?.hasAttribute("scroll-y")).toBe(true);

    fireEvent.tap(getPopoverBackdrop(container));

    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(container).not.toHaveTextContent("첫 번째");
  });

  it("keeps controlled open state until its owner updates it", () => {
    const onOpenChange = vi.fn();
    const { container } = render(<BasicSelect open={false} onOpenChange={onOpenChange} />);

    fireEvent.tap(getPopoverTrigger(container));

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(container).not.toHaveTextContent("첫 번째");
  });

  it("selects one value, closes the Popover, and keeps the selected value visible", () => {
    const onValueChange = vi.fn();
    const { container } = render(<BasicSelect defaultOpen onValueChange={onValueChange} />);

    fireEvent.tap(getItem(container, "첫 번째"));

    expect(onValueChange).toHaveBeenCalledWith(["first"]);
    expect(container).toHaveTextContent("첫 번째");
    expect(container).not.toHaveTextContent("두 번째");
  });

  it("toggles multiple values without closing the Popover", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <BasicSelect defaultOpen defaultValue={["first"]} multiple onValueChange={onValueChange} />,
    );

    fireEvent.tap(getItem(container, "두 번째"));
    fireEvent.tap(getItem(container, "첫 번째"));

    expect(onValueChange).toHaveBeenNthCalledWith(1, ["first", "second"]);
    expect(onValueChange).toHaveBeenNthCalledWith(2, ["second"]);
    expect(container).toHaveTextContent("두 번째");
  });

  it("only reports controlled value changes", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <BasicSelect defaultOpen value={["first"]} onValueChange={onValueChange} />,
    );

    fireEvent.tap(getItem(container, "두 번째"));

    expect(onValueChange).toHaveBeenCalledWith(["second"]);
    expect(container).toHaveTextContent("첫 번째");
  });

  it("ignores interaction when Root is disabled or read-only and when an Item is disabled", () => {
    const onValueChange = vi.fn();
    const { container, rerender } = render(
      <BasicSelect disabled open onValueChange={onValueChange} />,
    );

    fireEvent.tap(getItem(container, "첫 번째"));

    rerender(<BasicSelect open readOnly onValueChange={onValueChange} />);
    fireEvent.tap(getItem(container, "첫 번째"));

    rerender(
      <Select.Root
        open
        onValueChange={onValueChange}
        options={[{ disabled: true, textValue: "사용 불가", value: "disabled" }]}
      >
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Positioner>
          <Select.Content>
            <Select.Item value="disabled">
              <Select.ItemBody>
                <Select.ItemLabel />
              </Select.ItemBody>
            </Select.Item>
          </Select.Content>
        </Select.Positioner>
      </Select.Root>,
    );
    fireEvent.tap(getItem(container, "사용 불가"));

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("does not open a closed disabled or read-only Select", () => {
    const onOpenChange = vi.fn();
    const { container: disabledContainer } = render(
      <BasicSelect disabled onOpenChange={onOpenChange} />,
    );

    fireEvent.tap(getPopoverTrigger(disabledContainer));

    expect(onOpenChange).not.toHaveBeenCalled();

    const { container: readOnlyContainer } = render(
      <BasicSelect readOnly onOpenChange={onOpenChange} />,
    );
    fireEvent.tap(getPopoverTrigger(readOnlyContainer));

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("allows an initially closed disabled or read-only controlled Popover to close after opening", () => {
    const onOpenChange = vi.fn();
    const { container, rerender } = render(
      <BasicSelect disabled open={false} onOpenChange={onOpenChange} />,
    );

    rerender(<BasicSelect disabled open onOpenChange={onOpenChange} />);
    fireEvent.tap(getPopoverBackdrop(container));

    expect(onOpenChange).toHaveBeenLastCalledWith(false);

    rerender(<BasicSelect readOnly open={false} onOpenChange={onOpenChange} />);
    rerender(<BasicSelect readOnly open onOpenChange={onOpenChange} />);
    fireEvent.tap(getPopoverBackdrop(container));

    expect(onOpenChange).toHaveBeenCalledTimes(2);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("shows defaultValue before the Popover opens", () => {
    const { container } = render(<BasicSelect defaultValue={["first"]} />);

    expect(container).toHaveTextContent("첫 번째");
    expect(container).not.toHaveTextContent("두 번째");
  });

  it("removes stale labels and reflects updated options", () => {
    const { container, rerender } = render(
      <Select.Root options={[{ textValue: "이전 레이블", value: "first" }]} value={["first"]}>
        <Select.Trigger>
          <Select.Value />
          <Select.Placeholder>선택하세요</Select.Placeholder>
        </Select.Trigger>
      </Select.Root>,
    );

    expect(container).toHaveTextContent("이전 레이블");

    rerender(
      <Select.Root options={[]} value={["first"]}>
        <Select.Trigger>
          <Select.Value />
          <Select.Placeholder>선택하세요</Select.Placeholder>
        </Select.Trigger>
      </Select.Root>,
    );

    expect(container).not.toHaveTextContent("이전 레이블");
    expect(container).toHaveTextContent("선택하세요");

    rerender(
      <Select.Root options={[{ textValue: "새 레이블", value: "first" }]} value={["first"]}>
        <Select.Trigger>
          <Select.Value />
          <Select.Placeholder>선택하세요</Select.Placeholder>
        </Select.Trigger>
      </Select.Root>,
    );

    expect(container).not.toHaveTextContent("이전 레이블");
    expect(container).toHaveTextContent("새 레이블");
  });

  it("passes selected multiple options to formatValue in value order", () => {
    const formatValue = vi.fn(
      (selectedOptions: Select.Option[]) =>
        `선택됨: ${selectedOptions.map((option) => option.value).join(", ")}`,
    );
    const { container } = render(
      <BasicSelect defaultValue={["second", "first"]} formatValue={formatValue} multiple />,
    );

    expect(formatValue).toHaveBeenLastCalledWith([options[1], options[0]]);
    expect(container).toHaveTextContent("선택됨: second, first");
  });

  it("uses the measured trigger width unless Positioner style overrides it", () => {
    const { container, rerender } = render(<BasicSelect defaultOpen />);
    const trigger = container.querySelector<HTMLElement>(".test-select-trigger");

    if (!trigger) throw new Error("Expected Select trigger to exist.");

    act(() => {
      fireEvent.layoutchange(trigger, { width: 320 });
    });

    expect(popoverMocks.positionerProps.at(-1)?.style).toMatchObject({ width: "320px" });

    rerender(<BasicSelect defaultOpen positionerStyle={{ width: "240px" }} />);

    expect(popoverMocks.positionerProps.at(-1)?.style).toMatchObject({ width: "240px" });
  });

  it("forwards positioner placement, offsets, and auto adjustment", () => {
    render(
      <Select.Root defaultOpen options={[]}>
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Positioner
          autoAdjust="shift"
          crossAxisOffset={4}
          placement="top-end"
          placementOffset={12}
        >
          <Select.Content />
        </Select.Positioner>
      </Select.Root>,
    );

    expect(popoverMocks.positionerProps.at(-1)).toMatchObject({
      autoAdjust: "shift",
      crossAxisOffset: 4,
      placement: "top-end",
      placementOffset: 12,
    });
  });
});
