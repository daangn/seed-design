import "@testing-library/jest-dom";
import * as React from "@lynx-js/react";
import { render } from "@lynx-js/react/testing-library";
import type { MainThread } from "@lynx-js/types";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { LynxIconElementProps } from "../../types";

import * as Checkbox from "./Checkbox.namespace";

function getCheckboxRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Checkbox root to exist.");
  }

  if (root.classList.contains("seed-checkbox__root")) {
    return root;
  }

  const checkboxRoot = root.querySelector<HTMLElement>(".seed-checkbox__root");

  if (!checkboxRoot) {
    throw new Error("Expected Checkbox root to exist.");
  }

  return checkboxRoot;
}

const MockIcon = React.forwardRef<MainThread.Element, LynxIconElementProps & { src: string }>(
  (props, ref) => (
    <image
      {...props}
      {...(ref ? { "main-thread:ref": ref as React.Ref<MainThread.Element> } : {})}
    />
  ),
);
MockIcon.displayName = "MockIcon";

function renderIndicator(
  state: { checked?: boolean; indeterminate?: boolean },
  icons: { unchecked?: boolean; indeterminate?: boolean } = {
    unchecked: true,
    indeterminate: true,
  },
) {
  vi.spyOn(console, "warn").mockImplementation(() => {});
  render(
    <Checkbox.Root accessibility-label="알림" {...state}>
      <Checkbox.Control>
        <Checkbox.Indicator
          checked={<MockIcon src="checked.png" />}
          unchecked={icons.unchecked ? <MockIcon src="unchecked.png" /> : undefined}
          indeterminate={icons.indeterminate ? <MockIcon src="indeterminate.png" /> : undefined}
        />
      </Checkbox.Control>
    </Checkbox.Root>,
  );
  return Array.from(getCheckboxRoot().querySelectorAll("image"), (image) =>
    image.getAttribute("src"),
  );
}

describe("Checkbox", () => {
  afterEach(() => vi.restoreAllMocks());

  it("derives a root name and hides its label text", () => {
    render(
      <Checkbox.Root>
        <Checkbox.Label>알림</Checkbox.Label>
        <Checkbox.Label>받기</Checkbox.Label>
      </Checkbox.Root>,
    );

    const root = getCheckboxRoot();
    const label = root.querySelector(".seed-checkbox__label");
    expect(root).toHaveAttribute("accessibility-label", "알림 받기");
    expect(root).toHaveAttribute("flatten", "false");
    expect(label).toHaveAttribute("accessibility-element", "false");
    expect(label).toHaveAttribute("accessibility-elements-hidden", "true");
  });

  it("preserves explicit names, flattening, and label text visibility", () => {
    const { rerender } = render(
      <Checkbox.Root accessibility-label="사용자 이름" flatten>
        <Checkbox.Label accessibility-element accessibility-elements-hidden={false}>
          알림
        </Checkbox.Label>
      </Checkbox.Root>,
    );

    expect(getCheckboxRoot()).toHaveAttribute("accessibility-label", "사용자 이름");
    expect(getCheckboxRoot()).toHaveAttribute("flatten", "true");
    expect(getCheckboxRoot().querySelector(".seed-checkbox__label")).toHaveAttribute(
      "accessibility-element",
      "true",
    );
    expect(getCheckboxRoot().querySelector(".seed-checkbox__label")).toHaveAttribute(
      "accessibility-elements-hidden",
      "false",
    );

    rerender(
      <Checkbox.Root accessibility-element={false}>
        <Checkbox.Label>알림</Checkbox.Label>
      </Checkbox.Root>,
    );
    expect(getCheckboxRoot()).toHaveAttribute("accessibility-label", "알림");
    expect(getCheckboxRoot().querySelector(".seed-checkbox__label")).not.toHaveAttribute(
      "accessibility-elements-hidden",
    );
  });

  it("keeps a named group as a container unless explicitly overridden", () => {
    const { container, rerender } = render(
      <Checkbox.Group accessibility-label="알림 설정">
        <Checkbox.Root>
          <Checkbox.Label>알림</Checkbox.Label>
        </Checkbox.Root>
      </Checkbox.Group>,
    );
    const group = container.querySelector(".seed-checkbox-group__root");
    expect(group).toHaveAttribute("accessibility-element", "false");
    expect(group).toHaveAttribute("accessibility-label", "알림 설정");
    expect(getCheckboxRoot()).toHaveAttribute("accessibility-element", "true");

    rerender(<Checkbox.Group accessibility-element accessibility-label="알림 설정" />);
    expect(container.querySelector(".seed-checkbox-group__root")).toHaveAttribute(
      "accessibility-element",
      "true",
    );
  });

  it("warns only for an unnamed standalone accessibility element", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { rerender } = render(<Checkbox.Root />);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("accessibility-label"));
    warn.mockClear();

    rerender(
      <Checkbox.Root>
        <text>알림</text>
      </Checkbox.Root>,
    );
    expect(getCheckboxRoot()).not.toHaveAttribute("accessibility-label");
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("accessibility-label"));
    warn.mockClear();

    rerender(<Checkbox.Root accessibility-element={false} />);
    expect(warn).not.toHaveBeenCalledWith(expect.stringContaining("accessibility-label"));
    rerender(
      <Checkbox.Root accessibility-label="외부 이름">
        <Checkbox.Root />
      </Checkbox.Root>,
    );
    expect(warn).not.toHaveBeenCalledWith(expect.stringContaining("accessibility-label"));
  });

  it("exposes checkbox accessibility state", () => {
    const { rerender } = render(<Checkbox.Root accessibility-label="알림" />);

    expect(getCheckboxRoot()).toHaveAttribute("accessibility-element", "true");
    expect(getCheckboxRoot()).toHaveAttribute("accessibility-role-description", "checkbox");
    expect(getCheckboxRoot()).toHaveAttribute("accessibility-value", "not checked");
    expect(getCheckboxRoot()).not.toHaveAttribute("accessibility-traits");

    rerender(<Checkbox.Root accessibility-label="알림" checked disabled />);

    expect(getCheckboxRoot()).toHaveAttribute("accessibility-value", "checked");
    expect(getCheckboxRoot()).toHaveAttribute("accessibility-traits", "disabled");
  });

  it("prefers explicit accessibility props over defaults", () => {
    render(
      <Checkbox.Root
        checked
        disabled
        accessibility-element={false}
        accessibility-role-description="custom checkbox"
        accessibility-value="custom value"
        accessibility-traits="button"
      />,
    );

    const root = getCheckboxRoot();

    expect(root).toHaveAttribute("accessibility-element", "false");
    expect(root).toHaveAttribute("accessibility-role-description", "custom checkbox");
    expect(root).toHaveAttribute("accessibility-value", "custom value");
    expect(root).toHaveAttribute("accessibility-traits", "button");
  });

  it.each([
    [{}, "unchecked.png"],
    [{ checked: true }, "checked.png"],
    [{ checked: false, indeterminate: true }, "indeterminate.png"],
    [{ checked: true, indeterminate: true }, "indeterminate.png"],
  ])("renders the Indicator icon for %o", (state, src) => {
    expect(renderIndicator(state)).toEqual([src]);
  });

  it.each([
    [{}, { unchecked: false, indeterminate: true }],
    [
      { checked: true, indeterminate: true },
      { unchecked: true, indeterminate: false },
    ],
  ])("renders no Indicator icon when %o has no icon", (state, icons) => {
    expect(renderIndicator(state, icons)).toEqual([]);
  });
});
