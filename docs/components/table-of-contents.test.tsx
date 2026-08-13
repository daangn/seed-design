import { render } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { TOCProvider } from "fumadocs-ui/components/toc";
import { SeedTableOfContents } from "./table-of-contents";

class ResizeObserverStub implements ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const originalResizeObserver = globalThis.ResizeObserver;

beforeAll(() => {
  globalThis.ResizeObserver = ResizeObserverStub;
});

afterAll(() => {
  globalThis.ResizeObserver = originalResizeObserver;
});

describe("SeedTableOfContents", () => {
  it("uses the shared inline code treatment in mixed-format headings", () => {
    const { getByText } = render(
      <TOCProvider
        toc={[
          {
            depth: 3,
            title: (
              <>
                <code>onOpenChange</code> Details
              </>
            ),
            url: "#onopenchange-details",
          },
        ]}
      >
        <SeedTableOfContents />
      </TOCProvider>,
    );
    const code = getByText("onOpenChange");

    expect(code.classList.contains("rounded-r1")).toBe(true);
    expect(code.classList.contains("bg-bg-transparent-selected")).toBe(true);
    expect(code.classList.contains("px-0")).toBe(true);
    expect(code.classList.contains("py-x0_5")).toBe(true);
    expect(
      code.classList.contains(
        "[box-shadow:2px_0_0_var(--seed-color-bg-transparent-selected),-2px_0_0_var(--seed-color-bg-transparent-selected)]",
      ),
    ).toBe(true);
    expect(code.parentElement?.textContent).toBe("onOpenChange Details");
  });
});
