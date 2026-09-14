import "@testing-library/jest-dom";
import { fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import { Checkbox } from "../Checkbox";
import { Switch } from "../Switch";
import { RadioGroup } from "../RadioGroup";
import { List, ListHeader } from "./index";

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
}

function getListItem(className: string) {
  const item = getRenderedRoot().querySelector<HTMLElement>(`.${className}`);

  if (!item) {
    throw new Error(`Expected ${className} to exist.`);
  }

  return item;
}

describe("List", () => {
  it("renders a header variant", () => {
    render(
      <view>
        <ListHeader variant="boldSolid" className="list-header">
          목록 제목
        </ListHeader>
      </view>,
    );

    expect(getRenderedRoot().querySelector(".list-header")).toHaveClass(
      "seed-list-header--variant_boldSolid",
    );
  });

  it("renders the container and item slots", () => {
    render(
      <List.Root className="list-root">
        <List.Item highlighted className="static-item">
          <List.Prefix>앞</List.Prefix>
          <List.Content>
            <List.Title>제목</List.Title>
            <List.Detail>설명</List.Detail>
          </List.Content>
          <List.Suffix>뒤</List.Suffix>
        </List.Item>
      </List.Root>,
    );

    const item = getListItem("static-item");

    expect(getRenderedRoot().querySelector(".list-root")).toHaveClass("seed-list");
    expect(item.querySelector(".seed-list-item__prefix")).toHaveTextContent("앞");
    expect(item.querySelector(".seed-list-item__title")).toHaveTextContent("제목");
    expect(item.querySelector(".seed-list-item__detail")).toHaveTextContent("설명");
    expect(item.querySelector(".seed-list-item__suffix")).toHaveTextContent("뒤");
    expect(item.querySelector(".seed-list-item__pressedOverlay")).toHaveClass(
      "seed-list-item__pressedOverlay--highlighted_true",
    );
  });

  it("tracks button pressed state and ignores a disabled tap", async () => {
    const onTap = vi.fn();
    const { rerender } = render(
      <List.ButtonItem className="button-item" bindtap={onTap} accessibility-label="열기">
        <List.Content>
          <List.Title>버튼</List.Title>
        </List.Content>
      </List.ButtonItem>,
      { enableMainThread: true, enableBackgroundThread: true },
    );

    await waitSchedule();
    let item = getListItem("button-item");
    fireEvent.touchstart(item, {});
    await waitSchedule();
    expect(item.querySelector(".seed-list-item__pressedOverlay")).toHaveClass(
      "seed-list-item__pressedOverlay--pressed_true",
    );

    fireEvent.tap(item);
    await waitSchedule();
    expect(onTap).toHaveBeenCalledTimes(1);

    rerender(
      <List.ButtonItem disabled className="button-item" bindtap={onTap} accessibility-label="열기">
        <List.Content>
          <List.Title>버튼</List.Title>
        </List.Content>
      </List.ButtonItem>,
    );
    item = getListItem("button-item");
    fireEvent.tap(item);
    await waitSchedule();

    expect(onTap).toHaveBeenCalledTimes(1);
    expect(item).toHaveAttribute("accessibility-traits", "disabled");
    expect(item.querySelector(".seed-list-item__title")).toHaveClass(
      "seed-list-item__title--disabled_true",
    );
  });

  it("uses the existing checkbox and switch state", () => {
    const onCheckedChange = vi.fn();

    render(
      <List.Root>
        <List.CheckboxItem className="checkbox-item" onCheckedChange={onCheckedChange}>
          <List.Content>
            <List.Title>체크</List.Title>
          </List.Content>
        </List.CheckboxItem>
        <List.SwitchItem className="switch-item">
          <List.Content>
            <List.Title>스위치</List.Title>
          </List.Content>
        </List.SwitchItem>
      </List.Root>,
    );

    const checkbox = getListItem("checkbox-item");
    const checkboxRoot = checkbox.parentElement as HTMLElement;
    expect(checkbox).toHaveAttribute("accessibility-value", "선택 안 됨");
    fireEvent.tap(checkboxRoot);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(checkbox).toHaveAttribute("accessibility-value", "선택됨");

    const switchItem = getListItem("switch-item");
    const switchRoot = switchItem.parentElement as HTMLElement;
    expect(switchItem).toHaveAttribute("accessibility-value", "꺼짐");
    fireEvent.tap(switchRoot);
    expect(switchItem).toHaveAttribute("accessibility-value", "켜짐");
  });

  it("uses radio-group selection state", () => {
    render(
      <RadioGroup.Root defaultValue="first">
        <List.RadioItem value="first" className="first-radio">
          <List.Content>
            <List.Title>첫 번째</List.Title>
          </List.Content>
        </List.RadioItem>
        <List.RadioItem value="second" className="second-radio">
          <List.Content>
            <List.Title>두 번째</List.Title>
          </List.Content>
        </List.RadioItem>
      </RadioGroup.Root>,
    );

    const first = getListItem("first-radio");
    const second = getListItem("second-radio");
    expect(first).toHaveAttribute("accessibility-value", "선택됨");
    expect(second).toHaveAttribute("accessibility-value", "선택 안 됨");

    fireEvent.tap(second.parentElement as HTMLElement);
    expect(first).toHaveAttribute("accessibility-value", "선택 안 됨");
    expect(second).toHaveAttribute("accessibility-value", "선택됨");
  });
  it("scales only interactive row content and suppresses nested control targets", () => {
    render(
      <List.Root>
        <List.Item className="static-row">
          <List.Title>Static</List.Title>
        </List.Item>
        <List.CheckboxItem className="check-row">
          <List.Prefix>
            <Checkbox.Control />
          </List.Prefix>
          <List.Title>Check</List.Title>
        </List.CheckboxItem>
        <List.SwitchItem className="switch-row">
          <List.Suffix>
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </List.Suffix>
        </List.SwitchItem>
        <RadioGroup.Root>
          <List.RadioItem value="a" className="radio-row">
            <List.Prefix>
              <RadioGroup.ItemControl />
            </List.Prefix>
          </List.RadioItem>
        </RadioGroup.Root>
      </List.Root>,
    );
    expect(getListItem("static-row").querySelector(".seed-list-item__layout")).not.toHaveAttribute(
      "flatten",
      "false",
    );
    for (const name of ["check-row", "switch-row", "radio-row"]) {
      const row = getListItem(name);
      const layout = row.querySelector(".seed-list-item__layout")!;
      expect(layout).toHaveAttribute("flatten", "false");
      expect(layout).not.toContainElement(row.querySelector(".seed-list-item__pressedOverlay"));
      if (name === "switch-row") {
        // Switch keeps its native view for its own thumb animation even without a scale target.
        expect(layout.querySelector(".seed-switchmark__root")).toHaveAttribute("flatten", "false");
      } else {
        expect(layout.querySelectorAll('[flatten="false"]')).toHaveLength(0);
      }
    }
  });
});
