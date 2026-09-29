import { render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "bun:test";
import { DialogContent, DialogDescription, DialogRoot, DialogTitle } from "./index";

describe("useDialog (title/description aria wiring)", () => {
  it("references title and description ids only when they are rendered", () => {
    render(
      <DialogRoot defaultOpen>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog Description</DialogDescription>
        </DialogContent>
      </DialogRoot>,
    );

    const content = document.querySelector('[role="dialog"]');
    expect(content).not.toBeNull();

    const labelledBy = content?.getAttribute("aria-labelledby");
    const describedBy = content?.getAttribute("aria-describedby");
    expect(document.getElementById(labelledBy ?? "")?.textContent).toBe("Dialog Title");
    expect(document.getElementById(describedBy ?? "")?.textContent).toBe("Dialog Description");
  });

  it("does not set dangling aria-labelledby/describedby when title/description are absent", () => {
    render(
      <DialogRoot defaultOpen>
        <DialogContent>
          <div>No title, no description</div>
        </DialogContent>
      </DialogRoot>,
    );

    const content = document.querySelector('[role="dialog"]');
    expect(content).not.toBeNull();
    expect(content).not.toHaveAttribute("aria-labelledby");
    expect(content).not.toHaveAttribute("aria-describedby");
  });
});

describe("Dialog automatic focus", () => {
  it("preserves the default focus behavior", async () => {
    const view = render(
      <DialogRoot defaultOpen>
        <DialogContent>
          <DialogTitle>Default focus</DialogTitle>
        </DialogContent>
      </DialogRoot>,
    );
    await waitFor(() => expect(document.activeElement).toBe(view.getByRole("dialog")));
  });

  it("does not move focus or lock scroll for non-modal visual previews", async () => {
    // 이전 테스트의 FocusScope가 예약한 unmount 포커스 복원을 먼저 완료한다.
    await new Promise((resolve) => setTimeout(resolve, 0));
    const view = render(<button type="button">Outside</button>);
    const outside = view.getByRole("button", { name: "Outside" });
    outside.focus();
    view.rerender(
      <>
        <button type="button">Outside</button>
        <DialogRoot defaultOpen modal={false} autoFocus={false}>
          <DialogContent>
            <DialogTitle>Preview</DialogTitle>
            <button type="button">Inside</button>
          </DialogContent>
        </DialogRoot>
      </>,
    );
    await waitFor(() => expect(view.getByRole("dialog")).toHaveAttribute("aria-modal", "false"));
    expect(document.activeElement).toBe(outside);
    expect(document.documentElement.style.overflow).not.toBe("hidden");
  });
});
