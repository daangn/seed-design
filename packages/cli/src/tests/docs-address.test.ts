import { describe, expect, it } from "bun:test";

import type { DocsCategory } from "@/src/schema";
import {
  byAddress,
  childrenOf,
  parseAddress,
  resolveDocuments,
  resolveScopes,
} from "@/src/utils/docs-address";
import { alignedLines } from "@/src/utils/docs-index";

/**
 * The address grammar, read off the functions that implement it rather than through a spawned
 * CLI. Every rule here is answered by the index alone, so none of it needs a server, a process
 * or a working directory — what `docs-command.test.ts` still spawns for is the wiring around
 * these answers, and the streams and exit codes only a process has.
 *
 * The shapes that make the rules bite are all present below: a landing page sitting at the path
 * of a container, one id under two containers of a single category, the same id in two
 * categories, and a container nested inside another.
 */
const categories: DocsCategory[] = [
  {
    id: "lynx",
    label: "Lynx",
    items: [
      { id: "action-button", title: "Action Button", docUrl: "/lynx/components/action-button" },
      { id: "checkbox", title: "Checkbox", docUrl: "/lynx/components/checkbox", deprecated: true },
    ],
  },
  {
    id: "react",
    label: "React",
    items: [
      { id: "overview", title: "Overview", docUrl: "/react" },
      { id: "action-button", title: "Action Button", docUrl: "/react/components/action-button" },
      { id: "bottom-sheet", title: "Bottom Sheet", docUrl: "/react/components/bottom-sheet" },
      {
        id: "composition",
        title: "Composition",
        docUrl: "/react/components/concepts/composition",
      },
      { id: "bottom-sheet", title: "Bottom Sheet", docUrl: "/react/stackflow/bottom-sheet" },
      { id: "changelog", title: "Changelog", docUrl: "/react/updates/changelog" },
    ],
  },
];

const addressesOf = (input: string) =>
  resolveDocuments(categories, parseAddress(input)).map((entry) => entry.address);

const scopesOf = (input: string) => resolveScopes(categories, parseAddress(input));

describe("parseAddress", () => {
  it("reads a leading slash as the whole path, and its absence as a tail", () => {
    expect(parseAddress("/react/components/action-button")).toEqual({
      kind: "exact",
      segments: ["react", "components", "action-button"],
    });
    expect(parseAddress("action-button")).toEqual({ kind: "tail", segments: ["action-button"] });
  });

  it("reads a trailing slash as a container, and keeps the two slashes independent", () => {
    expect(parseAddress("react/")).toEqual({
      kind: "scope",
      anchored: false,
      segments: ["react"],
    });
    expect(parseAddress("/react/")).toEqual({
      kind: "scope",
      anchored: true,
      segments: ["react"],
    });
  });

  it("reads nothing at all as the root scope", () => {
    for (const input of ["", "   ", "/"]) {
      expect(parseAddress(input)).toEqual({ kind: "scope", anchored: true, segments: [] });
    }
  });
});

describe("resolveDocuments", () => {
  it("matches an exact address against the whole path and nothing less", () => {
    expect(addressesOf("/react/components/action-button")).toEqual([
      "/react/components/action-button",
    ]);
    // Nobody's path, though two documents end with it.
    expect(addressesOf("/components/bottom-sheet")).toEqual([]);
  });

  it("reaches every document a tail ends, across categories and within one", () => {
    expect(addressesOf("action-button")).toEqual([
      "/lynx/components/action-button",
      "/react/components/action-button",
    ]);
    expect(addressesOf("bottom-sheet")).toEqual([
      "/react/components/bottom-sheet",
      "/react/stackflow/bottom-sheet",
    ]);
  });

  it("reaches one document once the tail is long enough to separate them", () => {
    expect(addressesOf("concepts/composition")).toEqual(["/react/components/concepts/composition"]);
  });

  it("separates a landing page from the container sitting at the same path", () => {
    expect(addressesOf("/react")).toEqual(["/react"]);
    expect(addressesOf("react/")).toEqual([]);
  });

  it("reaches nothing from a container, so nothing underneath is picked on the caller's behalf", () => {
    expect(addressesOf("react/updates/")).toEqual([]);
    expect(addressesOf("/")).toEqual([]);
  });

  it("reaches nothing for an address the index does not carry", () => {
    expect(addressesOf("/react/nope")).toEqual([]);
  });
});

describe("resolveScopes", () => {
  it("answers the root scope with the empty prefix", () => {
    expect(scopesOf("")).toEqual([""]);
  });

  it("takes an anchored container as given", () => {
    expect(scopesOf("/react/stackflow/")).toEqual(["/react/stackflow"]);
  });

  it("reaches the anchored container from a shortened one", () => {
    expect(scopesOf("stackflow/")).toEqual(scopesOf("/react/stackflow/"));
    expect(scopesOf("stackflow/")).toEqual(["/react/stackflow"]);
  });

  it("reaches every container a shortened name ends", () => {
    expect(scopesOf("components/")).toEqual(["/lynx/components", "/react/components"]);
  });

  it("reaches nothing for a name no path ends with", () => {
    expect(scopesOf("nonexistent/")).toEqual([]);
  });
});

describe("childrenOf", () => {
  it("lists the categories, and a landing page beside the container of the same name", () => {
    expect(childrenOf(categories, "")).toEqual([
      { address: "/lynx/", note: "문서 2개" },
      { address: "/react", note: "Overview" },
      { address: "/react/", note: "문서 5개" },
    ]);
  });

  it("descends exactly one level, counting everything below each container", () => {
    expect(childrenOf(categories, "/react")).toEqual([
      { address: "/react/components/", note: "문서 3개" },
      { address: "/react/stackflow/", note: "문서 1개" },
      { address: "/react/updates/", note: "문서 1개" },
    ]);
  });

  it("marks a container with a trailing slash and leaves a document without one", () => {
    expect(childrenOf(categories, "/react/components")).toEqual([
      { address: "/react/components/action-button", note: "Action Button" },
      { address: "/react/components/bottom-sheet", note: "Bottom Sheet" },
      { address: "/react/components/concepts/", note: "문서 1개" },
    ]);
  });

  it("marks a deprecated document", () => {
    expect(childrenOf(categories, "/lynx/components")).toEqual([
      { address: "/lynx/components/action-button", note: "Action Button" },
      { address: "/lynx/components/checkbox", note: "Checkbox (deprecated)" },
    ]);
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
        { address: "/react/components/", note: "문서 3개" },
        { address: "/react/updates/", note: "문서 1개" },
      ]),
    ).toEqual(["/react/components/  문서 3개", "/react/updates/     문서 1개"]);
  });

  it("leaves an address carrying no note bare, with no padding behind it", () => {
    expect(
      alignedLines([{ address: "/react/components/action-button" }, { address: "/react" }]),
    ).toEqual(["/react/components/action-button", "/react"]);
  });
});
