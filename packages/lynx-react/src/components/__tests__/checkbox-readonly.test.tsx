import { fireEvent, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import { CheckboxControl, CheckboxRoot } from "../Checkbox";

describe("CheckboxRoot readOnly", () => {
  it("keeps the enabled visual treatment but suppresses press and tap changes", () => {
    const onCheckedChange = vi.fn();

    const { getByTestId } = render(
      <view>
        <CheckboxRoot checked={false} data-testid="interactive">
          <CheckboxControl />
        </CheckboxRoot>
        <CheckboxRoot
          readOnly
          checked={false}
          onCheckedChange={onCheckedChange}
          data-testid="readonly"
        >
          <CheckboxControl />
        </CheckboxRoot>
      </view>,
    );

    const interactive = getByTestId("interactive");
    const readOnly = getByTestId("readonly");
    const readOnlyControlClassName = readOnly.firstChild.getAttribute("class");

    expect(readOnly.getAttribute("class")).toBe(interactive.getAttribute("class"));

    fireEvent.touchstart(readOnly);
    fireEvent.tap(readOnly);

    expect(readOnly.firstChild.getAttribute("class")).toBe(readOnlyControlClassName);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("keeps the default interactive tap behavior", () => {
    const onCheckedChange = vi.fn();
    const { getByTestId } = render(
      <CheckboxRoot checked={false} onCheckedChange={onCheckedChange} data-testid="checkbox">
        <CheckboxControl />
      </CheckboxRoot>,
    );

    fireEvent.tap(getByTestId("checkbox"));

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("does not keep the pressed class when tap toggles checked", () => {
    const { getByTestId } = render(
      <CheckboxRoot defaultChecked={false} data-testid="checkbox">
        <CheckboxControl variant="ghost" tone="brand" />
      </CheckboxRoot>,
    );

    const checkbox = getByTestId("checkbox");
    const control = checkbox.firstChild;

    fireEvent.touchstart(checkbox);
    expect(control.getAttribute("class")).toContain("pressed_true-checked_false");

    fireEvent.tap(checkbox);
    expect(control.getAttribute("class")).toContain("checked_true");
    expect(control.getAttribute("class")).not.toContain("pressed_true");
  });
});
