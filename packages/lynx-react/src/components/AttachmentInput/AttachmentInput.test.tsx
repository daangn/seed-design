import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import { AttachmentInput, AttachmentInputRoot, AttachmentInputContainer } from "./AttachmentInput";

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

  it("keeps caller native props and events on the attachment host", () => {
    const bindtap = vi.fn();
    const { container } = render(
      <AttachmentInputRoot
        accessibility-label="Upload attachments"
        data-foo="attachment-host"
        flatten={true}
        bindtap={bindtap}
      >
        <text>Choose attachments</text>
      </AttachmentInputRoot>,
    );
    const root = container.firstElementChild as HTMLElement;

    expect(root).toHaveAttribute("accessibility-label", "Upload attachments");
    expect(root).toHaveAttribute("data-foo", "attachment-host");
    expect(root).toHaveAttribute("flatten", "true");
    expect(root.querySelector("text")?.textContent).toBe("Choose attachments");
    fireEvent.tap(root);
    expect(bindtap).toHaveBeenCalledTimes(1);
  });

  it("tags the root, trigger, and items with the drawn item type", () => {
    const fileEntry = {
      id: "test",
      status: "success" as const,
      file: { uri: "file://test.png", name: "test.png", type: "image/png", size: 10 },
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
