import { render } from "@testing-library/react";
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
