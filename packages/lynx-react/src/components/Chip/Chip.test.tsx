import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import { AccessibilityElementScope } from "../../utils/accessibility";
import * as Chip from "./Chip.namespace";

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
}

function getChipRoot() {
  const root = getRenderedRoot();

  if (root.classList.contains("seed-chip__root")) return root;

  const chipRoot = root.querySelector<HTMLElement>(".seed-chip__root");
  if (!chipRoot) throw new Error("Expected Chip root to exist.");

  return chipRoot;
}

describe("Chip", () => {
  it("renders the button and label recipe slots", () => {
    render(
      <Chip.Button size="large" variant="outlineStrong">
        <Chip.Label>버튼 칩</Chip.Label>
      </Chip.Button>,
    );

    const root = getChipRoot();
    const label = root.querySelector(".seed-chip__label");

    expect(root).toHaveClass("seed-chip__root--size_large");
    expect(root).toHaveClass("seed-chip__root--variant_outlineStrong");
    expect(root).toHaveAttribute("accessibility-role-description", "button");
    expect(root).toHaveAttribute("accessibility-label", "버튼 칩");
    expect(root).toHaveAttribute("accessibility-element", "true");
    expect(root).toHaveAttribute("flatten", "false");
    expect(label).toHaveAttribute("accessibility-element", "false");
    expect(label).toHaveAttribute("accessibility-elements-hidden", "true");
    expect(label).toHaveTextContent("버튼 칩");
    expect(label).toHaveClass("seed-chip__label--size_large");
  });

  it("toggles uncontrolled checked state after the consumer tap handler", () => {
    const calls: string[] = [];
    render(
      <Chip.Toggle
        bindtap={() => calls.push("tap")}
        onCheckedChange={(checked) => calls.push(`checked:${checked}`)}
      >
        <Chip.Label>토글 칩</Chip.Label>
      </Chip.Toggle>,
    );

    const root = getChipRoot();
    expect(root).toHaveClass("seed-chip__root--selected_false");
    expect(root).toHaveAttribute("accessibility-role-description", "checkbox");
    expect(root).toHaveAttribute("accessibility-value", "not checked");
    expect(root).toHaveAttribute("accessibility-label", "토글 칩");
    expect(root).toHaveAttribute("accessibility-element", "true");
    expect(root).toHaveAttribute("flatten", "false");
    expect(root.querySelector(".seed-chip__label")).toHaveAttribute(
      "accessibility-elements-hidden",
      "true",
    );

    fireEvent.tap(root);

    expect(calls).toEqual(["tap", "checked:true"]);
    expect(getChipRoot()).toHaveClass("seed-chip__root--selected_true");
    expect(getChipRoot()).toHaveAttribute("accessibility-value", "checked");
  });

  it("does not toggle or call the consumer tap handler when disabled", () => {
    const onCheckedChange = vi.fn();
    const onTap = vi.fn();
    render(
      <Chip.Toggle disabled bindtap={onTap} onCheckedChange={onCheckedChange}>
        <Chip.Label>비활성 칩</Chip.Label>
      </Chip.Toggle>,
    );

    const root = getChipRoot();
    fireEvent.tap(root);

    expect(onTap).not.toHaveBeenCalled();
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(root).toHaveClass("seed-chip__root--disabled_true");
    expect(root).toHaveAttribute("accessibility-traits", "disabled");
  });

  it("selects one radio item after the consumer tap handler and reports the value", () => {
    const calls: string[] = [];
    render(
      <Chip.RadioRoot
        defaultValue="first"
        onValueChange={(value) => calls.push(`value:${value}`)}
        accessibility-label="칩 선택"
      >
        <Chip.RadioItem value="first">
          <Chip.Label>첫 번째</Chip.Label>
        </Chip.RadioItem>
        <Chip.RadioItem value="second" bindtap={() => calls.push("tap")}>
          <Chip.Label>두 번째</Chip.Label>
        </Chip.RadioItem>
      </Chip.RadioRoot>,
    );

    const roots = getRenderedRoot().querySelectorAll(".seed-chip__root");
    expect(roots[0]?.parentElement).toHaveAttribute("accessibility-role-description", "radiogroup");
    expect(roots[0]?.parentElement).toHaveAttribute("accessibility-element", "false");
    expect(roots[0]?.parentElement).toHaveAttribute("accessibility-label", "칩 선택");
    expect(roots[0]).toHaveAttribute("accessibility-element", "true");
    expect(roots[1]).toHaveAttribute("accessibility-element", "true");
    expect(roots[0]).toHaveAttribute("accessibility-label", "첫 번째");
    expect(roots[1]).toHaveAttribute("accessibility-label", "두 번째");
    expect(roots[0]).toHaveAttribute("flatten", "false");
    expect(roots[1]).toHaveAttribute("flatten", "false");
    expect(roots[0]?.querySelector(".seed-chip__label")).toHaveAttribute(
      "accessibility-elements-hidden",
      "true",
    );
    expect(roots[1]?.querySelector(".seed-chip__label")).toHaveAttribute(
      "accessibility-elements-hidden",
      "true",
    );
    expect(roots[0]).toHaveClass("seed-chip__root--selected_true");
    expect(roots[1]).toHaveClass("seed-chip__root--selected_false");
    expect(roots[0]).toHaveAttribute("accessibility-role-description", "radio");
    expect(roots[0]).toHaveAttribute("accessibility-value", "selected");
    expect(roots[1]).toHaveAttribute("accessibility-value", "not selected");

    fireEvent.tap(roots[1] as HTMLElement);

    expect(calls).toEqual(["tap", "value:second"]);
    const updatedRoots = getRenderedRoot().querySelectorAll(".seed-chip__root");
    expect(updatedRoots[0]).toHaveClass("seed-chip__root--selected_false");
    expect(updatedRoots[1]).toHaveClass("seed-chip__root--selected_true");
    expect(updatedRoots[0]).toHaveAttribute("accessibility-value", "not selected");
    expect(updatedRoots[1]).toHaveAttribute("accessibility-value", "selected");
    expect(updatedRoots[0]).toHaveAttribute("accessibility-label", "첫 번째");
    expect(updatedRoots[1]).toHaveAttribute("accessibility-label", "두 번째");
  });

  it("prefers custom accessibility props to defaults", () => {
    render(
      <view>
        <Chip.Button
          disabled
          accessibility-role-description="custom button"
          accessibility-traits="link"
        />
        <Chip.Toggle
          disabled
          defaultChecked
          accessibility-role-description="custom toggle"
          accessibility-traits="link"
          accessibility-value="custom checked"
        />
        <Chip.RadioRoot defaultValue="selected" disabled>
          <Chip.RadioItem
            value="selected"
            accessibility-role-description="custom radio"
            accessibility-traits="link"
            accessibility-value="custom selected"
          />
        </Chip.RadioRoot>
      </view>,
    );

    const roots = getRenderedRoot().querySelectorAll(".seed-chip__root");
    expect(roots[0]).toHaveAttribute("accessibility-role-description", "custom button");
    expect(roots[0]).toHaveAttribute("accessibility-traits", "link");
    expect(roots[1]).toHaveAttribute("accessibility-role-description", "custom toggle");
    expect(roots[1]).toHaveAttribute("accessibility-traits", "link");
    expect(roots[1]).toHaveAttribute("accessibility-value", "custom checked");
    expect(roots[2]).toHaveAttribute("accessibility-role-description", "custom radio");
    expect(roots[2]).toHaveAttribute("accessibility-traits", "link");
    expect(roots[2]).toHaveAttribute("accessibility-value", "custom selected");
  });

  it("prefers explicit root labels and label text accessibility props", () => {
    render(
      <view>
        <Chip.Button accessibility-label="버튼 이름">
          <Chip.Label>버튼 텍스트</Chip.Label>
        </Chip.Button>
        <Chip.Toggle accessibility-label="토글 이름">
          <Chip.Label accessibility-element={true} accessibility-elements-hidden={false}>
            토글 텍스트
          </Chip.Label>
        </Chip.Toggle>
        <Chip.RadioRoot defaultValue="selected">
          <Chip.RadioItem value="selected" accessibility-label="항목 이름">
            <Chip.Label>항목 텍스트</Chip.Label>
          </Chip.RadioItem>
        </Chip.RadioRoot>
      </view>,
    );

    const roots = getRenderedRoot().querySelectorAll(".seed-chip__root");
    expect(roots[0]).toHaveAttribute("accessibility-label", "버튼 이름");
    expect(roots[1]).toHaveAttribute("accessibility-label", "토글 이름");
    expect(roots[2]).toHaveAttribute("accessibility-label", "항목 이름");
    const label = roots[1]?.querySelector(".seed-chip__label");
    expect(label).toHaveAttribute("accessibility-element", "true");
    expect(label).toHaveAttribute("accessibility-elements-hidden", "false");
  });

  it("disables nested accessibility elements and skips label derivation and warnings", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    try {
      render(
        <AccessibilityElementScope>
          <view>
            <Chip.Button>
              <Chip.Label>중첩 버튼</Chip.Label>
            </Chip.Button>
            <Chip.Toggle>
              <Chip.Label>중첩 토글</Chip.Label>
            </Chip.Toggle>
            <Chip.RadioRoot defaultValue="nested">
              <Chip.RadioItem value="nested">
                <Chip.Label>중첩 항목</Chip.Label>
              </Chip.RadioItem>
              <Chip.RadioItem value="explicit" accessibility-element={true} />
            </Chip.RadioRoot>
            <Chip.Button accessibility-element={true} />
            <Chip.Toggle accessibility-element={true} />
          </view>
        </AccessibilityElementScope>,
      );

      const roots = getRenderedRoot().querySelectorAll(".seed-chip__root");
      for (const root of Array.from(roots).slice(0, 3)) {
        expect(root).toHaveAttribute("accessibility-element", "false");
        expect(root).not.toHaveAttribute("accessibility-label");
        expect(root.querySelector(".seed-chip__label")).toHaveAttribute(
          "accessibility-elements-hidden",
          "true",
        );
      }
      for (const root of Array.from(roots).slice(3)) {
        expect(root).toHaveAttribute("accessibility-element", "true");
        expect(root).not.toHaveAttribute("accessibility-label");
      }
      expect(
        warn.mock.calls.filter(([message]) =>
          /^Chip(Button|Toggle|RadioItem):/.test(String(message)),
        ),
      ).toHaveLength(0);
    } finally {
      warn.mockRestore();
    }
  });

  it("preserves explicit nested labels and native element and flatten overrides", () => {
    render(
      <AccessibilityElementScope>
        <view>
          <Chip.Button
            accessibility-element={true}
            accessibility-label="중첩 버튼 이름"
            flatten={true}
          >
            <Chip.Label>버튼 텍스트</Chip.Label>
          </Chip.Button>
          <Chip.Toggle
            accessibility-element={true}
            accessibility-label="중첩 토글 이름"
            flatten={true}
          >
            <Chip.Label>토글 텍스트</Chip.Label>
          </Chip.Toggle>
          <Chip.RadioRoot
            defaultValue="selected"
            accessibility-element={true}
            accessibility-label="중첩 그룹 이름"
          >
            <Chip.RadioItem
              value="selected"
              accessibility-element={true}
              accessibility-label="중첩 항목 이름"
              flatten={true}
            >
              <Chip.Label>항목 텍스트</Chip.Label>
            </Chip.RadioItem>
          </Chip.RadioRoot>
        </view>
      </AccessibilityElementScope>,
    );

    const roots = getRenderedRoot().querySelectorAll(".seed-chip__root");
    expect(roots[0]).toHaveAttribute("accessibility-label", "중첩 버튼 이름");
    expect(roots[1]).toHaveAttribute("accessibility-label", "중첩 토글 이름");
    expect(roots[2]).toHaveAttribute("accessibility-label", "중첩 항목 이름");
    for (const root of Array.from(roots)) {
      expect(root).toHaveAttribute("accessibility-element", "true");
      expect(root).toHaveAttribute("flatten", "true");
    }
    expect(roots[2]?.parentElement).toHaveAttribute("accessibility-element", "true");
    expect(roots[2]?.parentElement).toHaveAttribute("accessibility-label", "중첩 그룹 이름");
  });

  it("warns for unnamed accessible controls but not explicitly disabled elements", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    try {
      render(
        <view>
          <Chip.Button />
          <Chip.Toggle />
          <Chip.RadioRoot>
            <Chip.RadioItem value="unnamed" />
            <Chip.RadioItem value="not-element" accessibility-element={false} />
          </Chip.RadioRoot>
          <Chip.Button accessibility-element={false} />
          <Chip.Toggle accessibility-element={false} />
        </view>,
      );

      expect(
        warn.mock.calls.filter(([message]) =>
          /^Chip(Button|Toggle|RadioItem):/.test(String(message)),
        ),
      ).toHaveLength(3);
      const roots = getRenderedRoot().querySelectorAll(".seed-chip__root");
      for (const root of Array.from(roots).slice(3)) {
        expect(root).toHaveAttribute("accessibility-element", "false");
      }
    } finally {
      warn.mockRestore();
    }
  });

  it("omits explicit empty native labels without replacing them with children text", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    try {
      render(
        <view>
          <Chip.Button accessibility-label="">
            <Chip.Label>버튼 텍스트</Chip.Label>
          </Chip.Button>
          <Chip.Toggle accessibility-label="">
            <Chip.Label>토글 텍스트</Chip.Label>
          </Chip.Toggle>
          <Chip.RadioRoot>
            <Chip.RadioItem value="empty" accessibility-label="">
              <Chip.Label>항목 텍스트</Chip.Label>
            </Chip.RadioItem>
          </Chip.RadioRoot>
        </view>,
      );

      const roots = getRenderedRoot().querySelectorAll(".seed-chip__root");
      for (const root of Array.from(roots)) {
        expect(root).not.toHaveAttribute("accessibility-label");
      }
      expect(
        warn.mock.calls.filter(([message]) =>
          /^Chip(Button|Toggle|RadioItem):/.test(String(message)),
        ),
      ).toHaveLength(3);
    } finally {
      warn.mockRestore();
    }
  });

  it("keeps label text visible when the root is explicitly not an accessibility element", () => {
    render(
      <view>
        <Chip.Button accessibility-element={false}>
          <Chip.Label>버튼 텍스트</Chip.Label>
        </Chip.Button>
        <Chip.Toggle accessibility-element={false}>
          <Chip.Label>토글 텍스트</Chip.Label>
        </Chip.Toggle>
        <Chip.RadioRoot>
          <Chip.RadioItem value="plain" accessibility-element={false}>
            <Chip.Label>항목 텍스트</Chip.Label>
          </Chip.RadioItem>
        </Chip.RadioRoot>
      </view>,
    );

    const roots = getRenderedRoot().querySelectorAll(".seed-chip__root");
    for (const root of Array.from(roots)) {
      expect(root).toHaveAttribute("accessibility-element", "false");
      const label = root.querySelector(".seed-chip__label");
      expect(label).not.toHaveAttribute("accessibility-element");
      expect(label).not.toHaveAttribute("accessibility-elements-hidden");
    }
  });

  it("requires radio items to be rendered inside a radio root", () => {
    expect(() => {
      render(
        <Chip.RadioItem value="orphan">
          <Chip.Label>고립된 칩</Chip.Label>
        </Chip.RadioItem>,
      );
    }).toThrow();
  });
});
