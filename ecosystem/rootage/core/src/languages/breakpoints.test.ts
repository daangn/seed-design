import { describe, expect, test } from "bun:test";
import { factory } from "../parser";
import { getBreakpoints, getBreakpointsMjs } from "./breakpoints";

const viewportWidth = (modes: Array<{ id: string; minWidth?: number }>) => [
  factory.createTokenCollectionDeclaration("viewport-width", modes),
];

describe("getBreakpoints", () => {
  test("reads minWidth of each viewport-width mode in order", () => {
    expect(
      getBreakpoints(
        viewportWidth([
          { id: "base", minWidth: 0 },
          { id: "sm", minWidth: 480 },
        ]),
      ),
    ).toEqual([
      { id: "base", minWidth: 0 },
      { id: "sm", minWidth: 480 },
    ]);
  });

  test("rejects a mode without minWidth", () => {
    expect(() =>
      getBreakpoints(viewportWidth([{ id: "base", minWidth: 0 }, { id: "sm" }])),
    ).toThrow('Mode "sm" in "viewport-width" has no minWidth');
  });

  test("rejects a base mode that does not start at 0", () => {
    expect(() => getBreakpoints(viewportWidth([{ id: "base", minWidth: 1 }]))).toThrow(
      "must have minWidth 0",
    );
  });

  test("rejects modes out of ascending order", () => {
    expect(() =>
      getBreakpoints(
        viewportWidth([
          { id: "base", minWidth: 0 },
          { id: "md", minWidth: 768 },
          { id: "sm", minWidth: 480 },
        ]),
      ),
    ).toThrow("ascending minWidth order");
  });
});

describe("getBreakpointsMjs", () => {
  test("emits media queries for every mode but the base", () => {
    const code = getBreakpointsMjs([
      { id: "base", minWidth: 0 },
      { id: "sm", minWidth: 480 },
    ]);

    expect(code).toContain('export const breakpointNames = ["base", "sm"];');
    expect(code).toContain('  sm: "(min-width: 480px)",');
    expect(code).not.toContain('base: "(min-width');
  });
});
