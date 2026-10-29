import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import { AttachmentInputRoot, AttachmentInputContainer } from "./AttachmentInput";

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
});
