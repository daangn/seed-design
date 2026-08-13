import { render } from "@testing-library/react";
import { describe, expect, it } from "bun:test";
import type { ChangelogEntry } from "@/lib/parse-changelog";
import { ChangelogEntryItem } from "./changelog-entry-item";

const entry: ChangelogEntry = {
  commitRefs: [],
  contentBlocks: [
    {
      html: "<p>Use <code>Dialog</code>.</p>",
      plainText: "Use Dialog.",
      type: "markdown",
    },
  ],
  isDependencyOnly: false,
  order: 0,
  package: {
    name: "@seed-design/react",
    url: "https://github.com/daangn/seed-design",
    version: "2.1.0",
  },
  relatedPackages: [],
};

describe("ChangelogEntryItem", () => {
  it("uses the shared inline code treatment for markdown backticks", () => {
    const { getByText } = render(<ChangelogEntryItem entry={entry} hidePackages />);
    const code = getByText("Dialog");
    const prose = code.closest("div");

    expect(code.tagName).toBe("CODE");
    expect(prose?.classList.contains("[&_code]:rounded-r1")).toBe(true);
    expect(prose?.classList.contains("[&_code]:bg-bg-transparent-selected")).toBe(true);
    expect(prose?.classList.contains("[&_code]:px-0")).toBe(true);
    expect(prose?.classList.contains("[&_code]:py-x0_5")).toBe(true);
    expect(
      prose?.classList.contains(
        "[&_code]:[box-shadow:2px_0_0_var(--seed-color-bg-transparent-selected),-2px_0_0_var(--seed-color-bg-transparent-selected)]",
      ),
    ).toBe(true);
  });
});
