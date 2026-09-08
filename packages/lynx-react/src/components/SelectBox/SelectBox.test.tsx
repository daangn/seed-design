import "@testing-library/jest-dom";
import { act, fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import { RadioGroup } from "../RadioGroup";
import { CheckSelectBox, RadioSelectBox } from "./index";

function getRenderedRoot() {
  const root = elementTree.root;
  if (!root) throw new Error("Expected Lynx render root to exist.");
  return root;
}

function CheckItem() {
  return (
    <CheckSelectBox.Root accessibility-label="마케팅 정보 수신">
      <CheckSelectBox.Trigger>
        <CheckSelectBox.Content>
          <CheckSelectBox.Body>
            <CheckSelectBox.Label>마케팅 정보 수신</CheckSelectBox.Label>
          </CheckSelectBox.Body>
        </CheckSelectBox.Content>
      </CheckSelectBox.Trigger>
      <CheckSelectBox.Footer className="check-footer">
        <text>혜택 알림을 받습니다.</text>
      </CheckSelectBox.Footer>
    </CheckSelectBox.Root>
  );
}

describe("SelectBox", () => {
  it("shares checkbox touch state with content feedback and cancels without selecting", async () => {
    const onCheckedChange = vi.fn();
    const { container } = render(
      <CheckSelectBox.Root onCheckedChange={onCheckedChange}>
        <CheckSelectBox.Trigger>
          <CheckSelectBox.Label>선택</CheckSelectBox.Label>
        </CheckSelectBox.Trigger>
      </CheckSelectBox.Root>,
      { enableMainThread: true, enableBackgroundThread: true },
    );
    await waitSchedule();
    const trigger = container.querySelector<HTMLElement>(".seed-select-box__interactionRoot")!;
    const surface = container.querySelector(".seed-select-box__root")!;
    const content = container.querySelector(".seed-select-box__scaleContent")!;
    expect(content).toHaveAttribute("flatten", "false");
    expect(content).not.toContainElement(surface.querySelector(".seed-select-box__selectedStroke"));

    fireEvent.touchstart(trigger, {});
    await waitSchedule();
    expect(surface).toHaveClass("seed-select-box__root--pressed_true");
    fireEvent.touchcancel(trigger, {});
    await waitSchedule();
    expect(surface).toHaveClass("seed-select-box__root--pressed_false");
    expect(onCheckedChange).not.toHaveBeenCalled();

    fireEvent.tap(trigger);
    await waitSchedule();
    expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith(true);
  });

  it("lays out custom label content in a view", () => {
    render(
      <CheckSelectBox.Root accessibility-label="Melon New">
        <CheckSelectBox.Trigger>
          <CheckSelectBox.Label>
            <text>Melon</text>
            <view className="label-badge">
              <text>New</text>
            </view>
          </CheckSelectBox.Label>
        </CheckSelectBox.Trigger>
      </CheckSelectBox.Root>,
    );

    const label = getRenderedRoot().querySelector<HTMLElement>(".seed-select-box__label");

    expect(label?.tagName.toLowerCase()).toBe("view");
    expect(label?.querySelector(".label-badge")).toBeInTheDocument();
  });

  it("renders an initially open footer without starting from zero height", () => {
    render(
      <CheckSelectBox.Root accessibility-label="마케팅 정보 수신" defaultChecked>
        <CheckSelectBox.Trigger>
          <CheckSelectBox.Label>마케팅 정보 수신</CheckSelectBox.Label>
        </CheckSelectBox.Trigger>
        <CheckSelectBox.Footer className="check-footer">
          <text>혜택 알림을 받습니다.</text>
        </CheckSelectBox.Footer>
      </CheckSelectBox.Root>,
    );

    const root = getRenderedRoot();
    const footer = root.querySelector<HTMLElement>(".check-footer");
    const footerInner = footer?.querySelector<HTMLElement>(".seed-select-box__footerInner");

    expect(footer).toHaveStyle({ height: "auto" });

    act(() => {
      fireEvent.layoutchange(footerInner as HTMLElement, { height: 48 });
    });

    expect(footer).toHaveStyle({ height: "48px" });
  });

  it("toggles a check item and reveals the measured footer", () => {
    const onCheckedChange = vi.fn();
    render(
      <CheckSelectBox.Root accessibility-label="마케팅 정보 수신" onCheckedChange={onCheckedChange}>
        <CheckSelectBox.Trigger>
          <CheckSelectBox.Label>마케팅 정보 수신</CheckSelectBox.Label>
        </CheckSelectBox.Trigger>
        <CheckSelectBox.Footer className="check-footer">
          <text>혜택 알림을 받습니다.</text>
        </CheckSelectBox.Footer>
      </CheckSelectBox.Root>,
    );

    const root = getRenderedRoot();
    const interactionRoot = root.querySelector<HTMLElement>(".seed-select-box__interactionRoot");
    const surface = root.querySelector<HTMLElement>(".seed-select-box__root");
    const footer = root.querySelector<HTMLElement>(".check-footer");
    const footerInner = footer?.querySelector<HTMLElement>(".seed-select-box__footerInner");

    expect(surface).toHaveAttribute("accessibility-value", "not selected");
    expect(footer).toHaveStyle({ height: "0px" });
    expect(footer).toHaveAttribute("accessibility-elements-hidden", "true");

    act(() => {
      fireEvent.layoutchange(footerInner as HTMLElement, { height: 48 });
    });
    fireEvent.tap(interactionRoot as HTMLElement);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(surface).toHaveAttribute("accessibility-value", "selected");
    expect(footer).toHaveStyle({ height: "48px" });
    expect(footer).toHaveAttribute("accessibility-elements-hidden", "false");
  });

  it("uses vertical item layout for a multi-column group", () => {
    render(
      <CheckSelectBox.Group columns={2} className="select-box-group">
        <CheckItem />
        <CheckItem />
      </CheckSelectBox.Group>,
    );

    const root = getRenderedRoot();
    const group = root.querySelector<HTMLElement>(".select-box-group");
    const trigger = root.querySelector<HTMLElement>(".seed-select-box__trigger");

    expect(group).toHaveStyle({ gridTemplateColumns: "repeat(2, 1fr)" });
    expect(trigger?.className).toContain("seed-select-box__trigger--layout_vertical");
  });

  it("selects one radio item and ignores a disabled item", () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup.Root defaultValue="first" onValueChange={onValueChange}>
        <RadioSelectBox.Group>
          <RadioSelectBox.Item value="first" accessibility-label="첫 번째">
            <RadioSelectBox.Trigger>
              <RadioSelectBox.Label>첫 번째</RadioSelectBox.Label>
            </RadioSelectBox.Trigger>
          </RadioSelectBox.Item>
          <RadioSelectBox.Item value="second" accessibility-label="두 번째">
            <RadioSelectBox.Trigger>
              <RadioSelectBox.Label>두 번째</RadioSelectBox.Label>
              <RadioGroup.ItemControl>
                <RadioGroup.ItemIndicator />
              </RadioGroup.ItemControl>
            </RadioSelectBox.Trigger>
          </RadioSelectBox.Item>
          <RadioSelectBox.Item value="disabled" accessibility-label="비활성" disabled>
            <RadioSelectBox.Trigger>
              <RadioSelectBox.Label>비활성</RadioSelectBox.Label>
            </RadioSelectBox.Trigger>
          </RadioSelectBox.Item>
        </RadioSelectBox.Group>
      </RadioGroup.Root>,
    );

    const root = getRenderedRoot();
    const interactionRoots = root.querySelectorAll<HTMLElement>(
      ".seed-select-box__interactionRoot",
    );
    const surfaces = root.querySelectorAll<HTMLElement>(".seed-select-box__root");
    const radioContent = surfaces[1].querySelector(".seed-select-box__scaleContent");
    const radioMark = surfaces[1].querySelector(".seed-radiomark__root");

    expect(radioContent).toHaveAttribute("flatten", "false");
    expect(radioMark).not.toHaveAttribute("flatten", "false");

    expect(surfaces[0]).toHaveAttribute("accessibility-value", "selected");
    expect(surfaces[1]).toHaveAttribute("accessibility-value", "not selected");

    fireEvent.tap(interactionRoots[1]);
    expect(onValueChange).toHaveBeenCalledWith("second");
    expect(surfaces[0]).toHaveAttribute("accessibility-value", "not selected");
    expect(surfaces[1]).toHaveAttribute("accessibility-value", "selected");

    fireEvent.tap(interactionRoots[2]);
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(surfaces[2]).toHaveAttribute("accessibility-traits", "disabled");
  });
});
