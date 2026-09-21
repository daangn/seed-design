import { describe, expect, it } from "bun:test";

import type { DocsCategory } from "@/src/schema";
import { byAddress, documentListings, findDocument, summaryOf } from "@/src/utils/docs-address";
import { alignedLines } from "@/src/utils/docs-index";

/**
 * What the subcommands take and print, read off the functions that implement it rather than
 * through a spawned CLI. Every rule here is answered by the index alone, so none of it needs a
 * server, a process or a working directory — what `docs-command.test.ts` still spawns for is the
 * wiring around these answers, and the streams and exit codes only a process has.
 *
 * The index below carries the shapes a lenient reader would guess at: a landing page at its
 * category's own path, one id in two categories and in two places of one category, and a path
 * nested a level deeper than its neighbours.
 */
const categories: DocsCategory[] = [
  {
    id: "lynx",
    label: "Lynx",
    items: [
      {
        id: "action-button",
        title: "Action Button",
        docUrl: "/lynx/components/action-button",
        llmsUrl: "/lynx/components/action-button.md",
      },
      {
        id: "checkbox",
        title: "Checkbox",
        docUrl: "/lynx/components/checkbox",
        llmsUrl: "/lynx/components/checkbox.md",
        deprecated: true,
      },
    ],
  },
  {
    id: "react",
    label: "React",
    items: [
      { id: "overview", title: "Overview", docUrl: "/react", llmsUrl: "/react.md" },
      {
        id: "action-button",
        title: "Action Button",
        description: "명확한 액션을 수행하는 버튼입니다.",
        docUrl: "/react/components/action-button",
        llmsUrl: "/react/components/action-button.md",
      },
      {
        id: "bottom-sheet",
        title: "Bottom Sheet",
        docUrl: "/react/components/bottom-sheet",
        llmsUrl: "/react/components/bottom-sheet.md",
      },
      {
        id: "composition",
        title: "Composition",
        docUrl: "/react/components/concepts/composition",
        llmsUrl: "/react/components/concepts/composition.md",
      },
      {
        id: "bottom-sheet",
        title: "Bottom Sheet",
        docUrl: "/react/stackflow/bottom-sheet",
        llmsUrl: "/react/stackflow/bottom-sheet.md",
      },
      {
        id: "changelog",
        title: "Changelog",
        docUrl: "/react/updates/changelog",
        llmsUrl: "/react/updates/changelog.md",
      },
    ],
  },
];

const addressOf = (input: string) => findDocument(categories, input)?.docUrl;

describe("findDocument", () => {
  it("finds a document by its address, in any category", () => {
    expect(addressOf("/react/components/action-button")).toBe("/react/components/action-button");
    expect(addressOf("/lynx/components/action-button")).toBe("/lynx/components/action-button");
    expect(addressOf("/react/components/concepts/composition")).toBe(
      "/react/components/concepts/composition",
    );
  });

  it("finds a category's landing page at the category's own path", () => {
    expect(addressOf("/react")).toBe("/react");
  });

  it("ignores the anchor a search result names its matching heading with", () => {
    expect(addressOf("/react/components/bottom-sheet#스냅-포인트")).toBe(
      "/react/components/bottom-sheet",
    );
  });

  it("finds nothing for any other form of the address", () => {
    for (const input of [
      "react/components/action-button",
      "/react/components/action-button/",
      " /react/components/action-button",
      "/react/components/action-button.md",
      "action-button",
      "concepts/composition",
      "/components/bottom-sheet",
      "react/",
      "/",
      "",
    ]) {
      expect(addressOf(input)).toBeUndefined();
    }
  });
});

describe("documentListings", () => {
  it("lists every document in address order, each with what its line says about it", () => {
    expect(documentListings(categories)).toEqual([
      { address: "/lynx/components/action-button", note: "Action Button" },
      { address: "/lynx/components/checkbox", note: "Checkbox (deprecated)" },
      { address: "/react", note: "Overview" },
      {
        address: "/react/components/action-button",
        note: "Action Button — 명확한 액션을 수행하는 버튼입니다.",
      },
      { address: "/react/components/bottom-sheet", note: "Bottom Sheet" },
      { address: "/react/components/concepts/composition", note: "Composition" },
      { address: "/react/stackflow/bottom-sheet", note: "Bottom Sheet" },
      { address: "/react/updates/changelog", note: "Changelog" },
    ]);
  });

  it("lists nothing outside the categories it is given", () => {
    expect(documentListings(categories.filter((category) => category.id === "lynx"))).toEqual([
      { address: "/lynx/components/action-button", note: "Action Button" },
      { address: "/lynx/components/checkbox", note: "Checkbox (deprecated)" },
    ]);
  });
});

describe("summaryOf", () => {
  const item = {
    id: "action-button",
    title: "Action Button",
    docUrl: "/react/components/action-button",
    llmsUrl: "/react/components/action-button.md",
  };

  it("gives the title alone when the index carries no description", () => {
    expect(summaryOf(item)).toBe("Action Button");
  });

  it("follows the title with the description", () => {
    expect(summaryOf({ ...item, description: "명확한 액션을 수행하는 버튼입니다." })).toBe(
      "Action Button — 명확한 액션을 수행하는 버튼입니다.",
    );
  });

  it("keeps the deprecation mark on the title, ahead of the description", () => {
    expect(summaryOf({ ...item, deprecated: true, description: "새 버튼을 쓰세요." })).toBe(
      "Action Button (deprecated) — 새 버튼을 쓰세요.",
    );
  });

  it("folds a description spanning several lines onto one", () => {
    expect(summaryOf({ ...item, description: "첫 줄입니다.\n  둘째 줄입니다.\n" })).toBe(
      "Action Button — 첫 줄입니다. 둘째 줄입니다.",
    );
  });
});

describe("byAddress", () => {
  it("orders by codepoint, so `-` sorts before `/`", () => {
    // `localeCompare` ignores both characters at its primary strength, which would leave this
    // order depending on LC_ALL.
    const sorted = [
      { address: "/react/components/action-button" },
      { address: "/react/components-guide" },
      { address: "/react/components" },
    ].sort(byAddress);

    expect(sorted.map((entry) => entry.address)).toEqual([
      "/react/components",
      "/react/components-guide",
      "/react/components/action-button",
    ]);
  });
});

describe("alignedLines", () => {
  it("pads every address to the widest one, so the notes line up", () => {
    expect(
      alignedLines([
        { address: "/react", note: "Overview" },
        { address: "/react/updates/changelog", note: "Changelog" },
      ]),
    ).toEqual(["/react                    Overview", "/react/updates/changelog  Changelog"]);
  });

  it("leaves an address carrying no note bare, with no padding behind it", () => {
    expect(
      alignedLines([{ address: "/react/components/action-button" }, { address: "/react" }]),
    ).toEqual(["/react/components/action-button", "/react"]);
  });
});
