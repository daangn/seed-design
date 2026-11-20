import "@testing-library/jest-dom";
import type * as React from "@lynx-js/react";
import { render, renderHook } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";
import { Field } from "../Field";
import {
  AttachmentInput,
  AttachmentInputRoot,
  AttachmentInputContainer,
  useAttachmentInput,
} from "./AttachmentInput";

describe("AttachmentInputRoot", () => {
  it("passes the safe-area extension to the scroll content without forwarding the prop to native", () => {
    const { container, rerender } = render(
      <AttachmentInputRoot extendSafeAreaX>
        <AttachmentInputContainer>
          <text>Attachment</text>
        </AttachmentInputContainer>
      </AttachmentInputRoot>,
    );
    expect(container.querySelector(".seed-attachment-input__root")).toHaveClass(
      "seed-attachment-input__root--extendSafeAreaX_true",
    );
    expect(container.querySelector(".seed-attachment-input__containerContent")).toHaveClass(
      "seed-attachment-input__containerContent--extendSafeAreaX_true",
    );
    expect(container.querySelector(".seed-attachment-input__root")).not.toHaveAttribute(
      "extendSafeAreaX",
    );
    rerender(
      <AttachmentInputRoot>
        <AttachmentInputContainer>
          <text>Attachment</text>
        </AttachmentInputContainer>
      </AttachmentInputRoot>,
    );
    expect(container.querySelector(".seed-attachment-input__containerContent")).not.toHaveClass(
      "seed-attachment-input__containerContent--extendSafeAreaX_true",
    );
  });
});

describe("AttachmentInput Field state fallback", () => {
  it("inherits omitted states from the enclosing Field", () => {
    const { container } = render(
      <Field.Root disabled required invalid>
        <AttachmentInputRoot />
      </Field.Root>,
    );
    const root = container.querySelector(".seed-attachment-input__root");

    expect(root).toHaveAttribute("data-disabled", "true");
    expect(root).toHaveAttribute("data-required", "true");
    expect(root).toHaveAttribute("data-invalid", "true");
  });

  it("prefers explicit states over the enclosing Field", () => {
    const { container } = render(
      <Field.Root disabled required invalid>
        <AttachmentInputRoot disabled={false} required={false} invalid={false} />
      </Field.Root>,
    );
    const root = container.querySelector(".seed-attachment-input__root");

    expect(root).toHaveAttribute("data-disabled", "false");
    expect(root).toHaveAttribute("data-required", "false");
    expect(root).toHaveAttribute("data-invalid", "false");
  });

  it("applies the same fallback in useAttachmentInput", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Field.Root readOnly invalid>
        {children}
      </Field.Root>
    );
    const { result } = renderHook(() => useAttachmentInput({ invalid: false }), { wrapper });

    expect(result.current).toMatchObject({
      readOnly: true,
      invalid: false,
      disabled: false,
    });
  });

  it("tags the root, trigger, and items with the drawn item type", () => {
    const fileEntry = {
      id: "test",
      status: "success" as const,
      file: {
        uri: "file://test.png",
        name: "test.png",
        type: "image/png",
        size: 10,
      },
    };
    const { container, rerender } = render(
      <AttachmentInput.Root defaultAcceptedFileEntries={[fileEntry]}>
        <AttachmentInput.Trigger />
        <AttachmentInput.Item fileEntry={fileEntry} />
        <AttachmentInput.Item fileEntry={fileEntry} type="image" />
      </AttachmentInput.Root>,
    );
    expect(container.querySelector(".seed-attachment-input__root")).toHaveAttribute(
      "lynx-test-tag",
      "seed:AttachmentInput",
    );
    expect(container.querySelector(".seed-attachment-input-trigger__root")).toHaveAttribute(
      "lynx-test-tag",
      "seed:AttachmentInputTrigger",
    );
    const items = container.querySelectorAll(".seed-attachment-input-item__root");
    expect(items[0]).toHaveAttribute("lynx-test-tag", "seed:AttachmentInputItem;type=general");
    expect(items[1]).toHaveAttribute("lynx-test-tag", "seed:AttachmentInputItem;type=image");

    rerender(<AttachmentInputRoot lynx-test-tag="listing-photos" />);
    expect(container.querySelector(".seed-attachment-input__root")).toHaveAttribute(
      "lynx-test-tag",
      "listing-photos",
    );
  });
});
