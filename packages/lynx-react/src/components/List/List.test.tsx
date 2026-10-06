import "@testing-library/jest-dom";
import { fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import { RadioGroup as HeadlessRadioGroup } from "@seed-design/lynx-react-radio-group";

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

  it("exposes each control row as one accessibility element with the control contract", () => {
    render(
      <List.Root>
        <List.CheckboxItem className="checkbox-item" indeterminate accessibility-label="체크">
          <List.Title>체크</List.Title>
          <List.Suffix>
            <Checkbox.Control />
          </List.Suffix>
        </List.CheckboxItem>
        <List.SwitchItem className="switch-item" accessibility-label="스위치">
          <List.Title>스위치</List.Title>
          <List.Suffix>
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </List.Suffix>
        </List.SwitchItem>
        <HeadlessRadioGroup.Root defaultValue="first">
          <List.RadioItem value="first" className="first-radio" accessibility-label="첫 번째">
            <List.Title>첫 번째</List.Title>
          </List.RadioItem>
          <List.RadioItem value="second" className="second-radio" accessibility-label="두 번째">
            <List.Title>두 번째</List.Title>
            <List.Suffix>
              <RadioGroup.ItemControl>
                <RadioGroup.ItemIndicator />
              </RadioGroup.ItemControl>
            </List.Suffix>
          </List.RadioItem>
        </HeadlessRadioGroup.Root>
      </List.Root>,
    );

    const checkbox = getListItem("checkbox-item");
    const switchItem = getListItem("switch-item");
    const first = getListItem("first-radio");
    const second = getListItem("second-radio");

    for (const [row, label, role] of [
      [checkbox, "체크", "checkbox"],
      [switchItem, "스위치", "switch"],
      [second, "두 번째", "radio"],
    ] as const) {
      expect(row).toHaveAttribute("accessibility-element", "true");
      expect(row).toHaveAttribute("accessibility-label", label);
      expect(row).toHaveAttribute("accessibility-role-description", role);
      expect(row.querySelectorAll('[accessibility-element="true"]')).toHaveLength(0);
    }

    expect(checkbox).toHaveAttribute("accessibility-value", "mixed");
    expect(checkbox.querySelector(".seed-checkmark__root")).toHaveClass(
      "seed-checkmark__root--indeterminate_true",
    );

    expect(switchItem).toHaveAttribute("accessibility-value", "not checked");
    fireEvent.tap(switchItem);
    expect(switchItem).toHaveAttribute("accessibility-value", "checked");
    expect(switchItem.querySelector(".seed-switchmark__root")).toHaveClass(
      "seed-switchmark__root--checked_true",
    );

    expect(first).toHaveAttribute("accessibility-value", "selected");
    expect(second).toHaveAttribute("accessibility-value", "not selected");
    fireEvent.tap(second);
    expect(first).toHaveAttribute("accessibility-value", "not selected");
    expect(second).toHaveAttribute("accessibility-value", "selected");
    expect(second.querySelector(".seed-radiomark__root")).toHaveClass(
      "seed-radiomark__root--checked_true",
    );
  });

  it("keeps controlled checkbox values with the parent and blocks disabled rows", () => {
    const onCheckedChange = vi.fn();
    const onSwitchChange = vi.fn();
    const onValueChange = vi.fn();

    render(
      <List.Root>
        <List.CheckboxItem
          className="checkbox-item"
          checked={false}
          onCheckedChange={onCheckedChange}
        >
          <List.Title>체크</List.Title>
        </List.CheckboxItem>
        <List.SwitchItem className="switch-item" disabled onCheckedChange={onSwitchChange}>
          <List.Title>스위치</List.Title>
        </List.SwitchItem>
        <HeadlessRadioGroup.Root disabled defaultValue="first" onValueChange={onValueChange}>
          <List.RadioItem value="second" className="second-radio">
            <List.Title>두 번째</List.Title>
          </List.RadioItem>
        </HeadlessRadioGroup.Root>
      </List.Root>,
    );

    const checkbox = getListItem("checkbox-item");
    fireEvent.tap(checkbox);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(checkbox).toHaveAttribute("accessibility-value", "not checked");

    const switchItem = getListItem("switch-item");
    fireEvent.tap(switchItem);
    expect(onSwitchChange).not.toHaveBeenCalled();
    expect(switchItem).toHaveAttribute("accessibility-traits", "disabled");

    const second = getListItem("second-radio");
    fireEvent.tap(second);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(second).toHaveAttribute("accessibility-value", "not selected");
    expect(second).toHaveAttribute("accessibility-traits", "disabled");
    expect(second.querySelector(".seed-list-item__title")).toHaveClass(
      "seed-list-item__title--disabled_true",
    );
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
        <HeadlessRadioGroup.Root>
          <List.RadioItem value="a" className="radio-row">
            <List.Prefix>
              <RadioGroup.ItemControl />
            </List.Prefix>
          </List.RadioItem>
        </HeadlessRadioGroup.Root>
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
