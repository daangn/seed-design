import { describe, expect, test } from "vitest";
import { addRelativeComponents } from "../utils/add-relative-components";
import type { RegistryComponent } from "@/src/schema";

const config: RegistryComponent = [
  {
    name: "a",
    files: ["a.tsx"],
  },
  {
    name: "b",
    innerDependencies: ["a"],
    files: ["b.tsx"],
  },
  {
    name: "c",
    innerDependencies: ["b"],
    files: ["c.tsx"],
  },
  {
    name: "d",
    innerDependencies: ["a", "b"],
    files: ["d.tsx"],
  },
  {
    name: "e",
    innerDependencies: ["d"],
    files: ["d.tsx"],
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
