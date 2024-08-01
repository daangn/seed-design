import { describe, expect, test } from "vitest";
import { addRelativeComponents } from "../utils/add-relative-components";
import type { ComponentMetadataIndex } from "@/src/schema";

const config: ComponentMetadataIndex = [
  {
    name: "a",
    snippets: ["a.tsx"],
    type: "component",
  },
  {
    name: "b",
    innerDependencies: ["a"],
    snippets: ["b.tsx"],
    type: "component",
  },
  {
    name: "c",
    innerDependencies: ["b"],
    snippets: ["c.tsx"],
    type: "component",
  },
  {
    name: "d",
    innerDependencies: ["a", "b"],
    snippets: ["d.tsx"],
    type: "component",
  },
  {
    name: "e",
    innerDependencies: ["d"],
    snippets: ["d.tsx"],
    type: "component",
  },
];

describe("addRelativeComponents", () => {
  test("4 deps test", () => {
    const userSelects = ["e"];
    const result = addRelativeComponents(userSelects, config);
    expect(result).toEqual(expect.arrayContaining(["a", "b", "d", "e"]));
  });

  test("3 deps test", () => {
    const userSelects = ["d"];
    const result = addRelativeComponents(userSelects, config);
    expect(result).toEqual(expect.arrayContaining(["a", "b", "d"]));
  });

  test("3 deps test", () => {
    const userSelects = ["c"];
    const result = addRelativeComponents(userSelects, config);
    expect(result).toEqual(expect.arrayContaining(["a", "b", "c"]));
  });

  test("2 deps test", () => {
    const userSelects = ["b"];
    const result = addRelativeComponents(userSelects, config);
    expect(result).toEqual(expect.arrayContaining(["a", "b"]));
  });

  test("1 deps test", () => {
    const userSelects = ["a"];
    const result = addRelativeComponents(userSelects, config);
    expect(result).toEqual(expect.arrayContaining(["a"]));
  });
});
