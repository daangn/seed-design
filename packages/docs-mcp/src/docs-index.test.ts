import { describe, expect, it } from "bun:test";
import { type DocsIndexCategory, findItem, itemPath } from "./docs-index";

const react: DocsIndexCategory = {
  id: "react",
  label: "React",
  sections: [
    {
      id: "components",
      label: "Components",
      items: [
        { id: "alert-dialog", title: "Alert Dialog", docUrl: "/react/components/alert-dialog" },
        { id: "button", title: "Button", docUrl: "/react/components/button" },
      ],
    },
    {
      id: "stackflow",
      label: "Stackflow",
      items: [
        { id: "alert-dialog", title: "Alert Dialog", docUrl: "/react/stackflow/alert-dialog" },
      ],
    },
    {
      id: "overview",
      label: "Overview",
      items: [{ id: "overview", title: "React", docUrl: "/react" }],
    },
  ],
};

describe("itemPath", () => {
  it("strips the section prefix", () => {
    const item = react.sections[0].items[1];

    expect(itemPath(react, item)).toBe("components/button");
  });

  it("addresses the section landing page by id", () => {
    const item = react.sections[2].items[0];

    expect(itemPath(react, item)).toBe("overview");
  });

  // `replace` would have cut the `/react/` out of the middle and produced
  // `/lynx/components/button`, a path pointing at neither document.
  it("leaves an item filed outside the section alone", () => {
    const stray = { id: "button", title: "Button", docUrl: "/lynx/components/react/button" };

    expect(itemPath(react, stray)).toBe("/lynx/components/react/button");
  });
});

describe("findItem", () => {
  it("resolves a full path", () => {
    expect(findItem(react, "components/alert-dialog")?.docUrl).toBe(
      "/react/components/alert-dialog",
    );
    expect(findItem(react, "stackflow/alert-dialog")?.docUrl).toBe("/react/stackflow/alert-dialog");
  });

  it("resolves a bare id that only one document carries", () => {
    expect(findItem(react, "button")?.docUrl).toBe("/react/components/button");
  });

  it("tolerates a leading slash and a .txt suffix", () => {
    expect(findItem(react, "/components/button.txt")?.docUrl).toBe("/react/components/button");
  });

  it("returns nothing for a path no document has", () => {
    expect(findItem(react, "components/nope")).toBeUndefined();
  });

  it("rejects a bare id two documents share, naming both paths", () => {
    expect(() => findItem(react, "alert-dialog")).toThrow(
      "'alert-dialog' is ambiguous in section 'react'. Use one of: components/alert-dialog, stackflow/alert-dialog",
    );
  });
});
