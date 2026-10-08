import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import { AttachmentInputRoot } from "./AttachmentInput";

describe("AttachmentInputRoot", () => {
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
