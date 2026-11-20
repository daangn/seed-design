import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import type { CSSProperties } from "@lynx-js/types";
import { describe, expect, it } from "vitest";
import {
  AttachmentDisplay,
  AttachmentDisplayRoot,
  AttachmentDisplayControl,
  AttachmentDisplayContainer,
} from "./AttachmentDisplay";

describe("AttachmentDisplay lynx-test-tag", () => {
  it("tags the root, trigger, and image items, letting a consumer tag win", () => {
    const entry = { id: "test", status: "success" as const };
    const { container, rerender } = render(
      <AttachmentDisplay.Root defaultEntries={[entry]}>
        <AttachmentDisplay.Trigger />
        <AttachmentDisplay.Item entry={entry} />
      </AttachmentDisplay.Root>,
    );
    expect(container.querySelector(".seed-attachment-input__root")).toHaveAttribute(
      "lynx-test-tag",
      "seed:AttachmentInput",
    );
    expect(container.querySelector(".seed-attachment-input-trigger__root")).toHaveAttribute(
      "lynx-test-tag",
      "seed:AttachmentInputTrigger",
    );
    expect(container.querySelector(".seed-attachment-input-item__root")).toHaveAttribute(
      "lynx-test-tag",
      "seed:AttachmentInputItem;type=image",
    );

    rerender(<AttachmentDisplayRoot lynx-test-tag="review-photos" />);
    expect(container.querySelector(".seed-attachment-input__root")).toHaveAttribute(
      "lynx-test-tag",
      "review-photos",
    );
  });
});

describe("AttachmentDisplay safe-area extension", () => {
  it("inherits Root safe-area overrides through Control while allowing explicit Control styles", () => {
    const rootStyle: CSSProperties & Record<`--${string}`, string> = {
      "--seed-safe-area-left": "84px",
      "--seed-safe-area-right": "24px",
    };
    const controlStyle: CSSProperties & Record<`--${string}`, string> = {
      "--seed-safe-area-right": "32px",
    };
    const { getByTestId, rerender } = render(
      <AttachmentDisplayRoot extendSafeAreaX style={rootStyle} data-testid="root">
        <AttachmentDisplayControl extendSafeAreaX data-testid="control" />
      </AttachmentDisplayRoot>,
    );
    const styleProperty = (element: ReturnType<typeof getByTestId>, property: string) => {
      if (!element || !("style" in element)) throw new Error("Missing attachment element");
      return element.style.getPropertyValue(property) || Reflect.get(element.style, property);
    };
    expect(styleProperty(getByTestId("root"), "--seed-safe-area-left")).toBe("84px");
    expect(styleProperty(getByTestId("control"), "--seed-safe-area-left")).toBeUndefined();
    expect(styleProperty(getByTestId("control"), "--seed-safe-area-right")).toBeUndefined();

    rerender(
      <AttachmentDisplayRoot extendSafeAreaX style={rootStyle}>
        <AttachmentDisplayControl style={controlStyle} data-testid="control" />
      </AttachmentDisplayRoot>,
    );
    expect(styleProperty(getByTestId("control"), "--seed-safe-area-left")).toBeUndefined();
    expect(styleProperty(getByTestId("control"), "--seed-safe-area-right")).toBe("32px");

    rerender(
      <AttachmentDisplayRoot>
        <AttachmentDisplayControl extendSafeAreaX data-testid="control" />
      </AttachmentDisplayRoot>,
    );
    expect(styleProperty(getByTestId("control"), "--seed-safe-area-left")).toBe(
      "env(safe-area-inset-left)",
    );
    expect(styleProperty(getByTestId("control"), "--seed-safe-area-right")).toBe(
      "env(safe-area-inset-right)",
    );
  });

  it.each([
    false,
    true,
  ])("extends once when Root extension is %s and Control also requests it", (rootExtended) => {
    const { container } = render(
      <AttachmentDisplayRoot extendSafeAreaX={rootExtended}>
        <AttachmentDisplayControl extendSafeAreaX>
          <AttachmentDisplayContainer>
            <text>Attachment</text>
          </AttachmentDisplayContainer>
        </AttachmentDisplayControl>
      </AttachmentDisplayRoot>,
    );
    expect(
      container.querySelectorAll(".seed-attachment-input__root--extendSafeAreaX_true"),
    ).toHaveLength(1);
    expect(container.querySelector(".seed-attachment-input__containerContent")).toHaveClass(
      "seed-attachment-input__containerContent--extendSafeAreaX_true",
    );
  });

  it("inherits a Root extension through a default Control and clears it when toggled off", () => {
    const content = (
      <AttachmentDisplayControl>
        <AttachmentDisplayContainer>
          <text>Attachment</text>
        </AttachmentDisplayContainer>
      </AttachmentDisplayControl>
    );
    const { container, rerender } = render(
      <AttachmentDisplayRoot extendSafeAreaX>{content}</AttachmentDisplayRoot>,
    );
    expect(container.querySelector(".seed-attachment-input__containerContent")).toHaveClass(
      "seed-attachment-input__containerContent--extendSafeAreaX_true",
    );
    rerender(<AttachmentDisplayRoot>{content}</AttachmentDisplayRoot>);
    expect(
      container.querySelectorAll(".seed-attachment-input__root--extendSafeAreaX_true"),
    ).toHaveLength(0);
    expect(container.querySelector(".seed-attachment-input__containerContent")).not.toHaveClass(
      "seed-attachment-input__containerContent--extendSafeAreaX_true",
    );
  });
});
