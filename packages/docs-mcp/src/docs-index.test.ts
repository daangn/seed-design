import { describe, expect, it } from "bun:test";
import { type DocsIndex, findItem, searchResultLine } from "./docs-index";

describe("findItem", () => {
  const index: DocsIndex = {
    categories: [
      {
        id: "react",
        label: "React",
        items: [
          { id: "overview", title: "React", docUrl: "/react", llmsUrl: "/react.md" },
          {
            id: "button",
            title: "Button",
            docUrl: "/react/components/button",
            llmsUrl: "/react/components/button.md",
          },
          {
            id: "alert-dialog",
            title: "Alert Dialog",
            docUrl: "/react/stackflow/alert-dialog",
            llmsUrl: "/react/stackflow/alert-dialog.md",
          },
        ],
      },
      {
        id: "foundations",
        label: "Foundations",
        items: [
          {
            id: "color",
            title: "Color",
            docUrl: "/foundations/color",
            llmsUrl: "/foundations/color.md",
          },
        ],
      },
    ],
  };

  it("finds a document by its address, in any section", () => {
    expect(findItem(index, "/react/stackflow/alert-dialog")?.docUrl).toBe(
      "/react/stackflow/alert-dialog",
    );
    expect(findItem(index, "/foundations/color")?.docUrl).toBe("/foundations/color");
  });

  it("finds a section's own page at the section's address", () => {
    expect(findItem(index, "/react")?.docUrl).toBe("/react");
  });

  it("ignores the anchor a search result names its matching heading with", () => {
    expect(findItem(index, "/react/components/button#props")?.docUrl).toBe(
      "/react/components/button",
    );
  });

  it("finds nothing for any other form of the address", () => {
    for (const address of [
      "react/components/button",
      "/react/components/button/",
      "/react/components/button.md",
      "button",
      "/react/components/nope",
      "",
    ]) {
      expect(findItem(index, address)).toBeUndefined();
    }
  });
});

describe("searchResultLine", () => {
  const index: DocsIndex = {
    categories: [
      {
        id: "react",
        label: "React",
        items: [
          {
            id: "button",
            title: "Button",
            description: "누르면 동작을 실행합니다.",
            docUrl: "/react/components/button",
            llmsUrl: "/react/components/button.md",
          },
          {
            id: "alert-dialog",
            title: "Alert Dialog",
            docUrl: "/react/stackflow/alert-dialog",
            llmsUrl: "/react/stackflow/alert-dialog.md",
            deprecated: true,
          },
          {
            id: "bottom-sheet",
            title: "Bottom Sheet",
            description: "화면 아래에서\n  올라옵니다.",
            docUrl: "/react/components/bottom-sheet",
            llmsUrl: "/react/components/bottom-sheet.md",
          },
        ],
      },
    ],
  };

  it("follows the address, anchor and all, with its document's title and description", () => {
    expect(searchResultLine(index, "/react/components/button#props")).toBe(
      "/react/components/button#props  Button — 누르면 동작을 실행합니다.",
    );
  });

  it("gives a document without a description its title alone, deprecation marked", () => {
    expect(searchResultLine(index, "/react/stackflow/alert-dialog")).toBe(
      "/react/stackflow/alert-dialog  Alert Dialog (deprecated)",
    );
  });

  it("folds a description spanning several lines onto the result's one line", () => {
    expect(searchResultLine(index, "/react/components/bottom-sheet")).toBe(
      "/react/components/bottom-sheet  Bottom Sheet — 화면 아래에서 올라옵니다.",
    );
  });

  it("leaves an address the index lists no page for bare", () => {
    expect(searchResultLine(index, "/react/components/nope#usage")).toBe(
      "/react/components/nope#usage",
    );
  });
});
