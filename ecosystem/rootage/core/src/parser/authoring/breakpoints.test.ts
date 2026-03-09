import { describe, expect, it } from "bun:test";
import * as factory from "../factory";
import { fromString } from "./parse";

describe("parseBreakpointsDocument", () => {
  it("should parse breakpoints YAML to AST", () => {
    const yaml = `
kind: Breakpoints
metadata:
  id: breakpoint
  name: Breakpoint
data:
  breakpoints:
    base: 0
    sm: 480
    md: 768
    lg: 1280
    xl: 1440
`;

    const result = fromString(yaml);

    expect(result).toEqual(
      factory.createBreakpointsDocument(
        factory.createMetadataDeclaration([
          factory.createMetadataFieldDeclaration("id", "breakpoint"),
          factory.createMetadataFieldDeclaration("name", "Breakpoint"),
        ]),
        [
          factory.createBreakpointEntry("base", 0),
          factory.createBreakpointEntry("sm", 480),
          factory.createBreakpointEntry("md", 768),
          factory.createBreakpointEntry("lg", 1280),
          factory.createBreakpointEntry("xl", 1440),
        ],
      ),
    );
  });

  it("should sort entries by minWidth regardless of YAML order", () => {
    const yaml = `
kind: Breakpoints
metadata:
  id: breakpoint
  name: Breakpoint
data:
  breakpoints:
    xl: 1440
    base: 0
    sm: 480
`;

    const result = fromString(yaml);

    expect(result.kind).toBe("BreakpointsDocument");
    if (result.kind === "BreakpointsDocument") {
      expect(result.data.map((e) => e.name)).toEqual(["base", "sm", "xl"]);
    }
  });
});
