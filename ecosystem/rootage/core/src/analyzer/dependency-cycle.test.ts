import { describe, expect, it } from "bun:test";
import type { TokenRef } from "../parser/ast";
import { findDependencyCycle } from "./dependency-cycle";
import type { DependencyGraph } from "./types";

function createGraph(...nodes: [TokenRef, Record<string, TokenRef>][]): DependencyGraph {
  return Object.fromEntries(
    nodes.map(([name, dependencies]) => [name, { name, collection: "color", dependencies }]),
  );
}

describe("findDependencyCycle", () => {
  it("should return undefined if reference chains end in values", () => {
    const graph = createGraph(
      ["$color.a", { light: "$color.b" }],
      ["$color.b", { light: "$color.c" }],
      ["$color.c", {}],
      ["$color.d", { light: "$color.b" }],
    );

    expect(findDependencyCycle(graph)).toBeUndefined();
  });

  it("should return undefined if tokens reference each other only in different modes", () => {
    const graph = createGraph(
      ["$color.a", { light: "$color.b" }],
      ["$color.b", { dark: "$color.a" }],
    );

    expect(findDependencyCycle(graph)).toBeUndefined();
  });

  it("should return a token that references itself", () => {
    const graph = createGraph(["$color.a", { light: "$color.a" }]);

    expect(findDependencyCycle(graph)).toEqual({
      mode: "light",
      path: ["$color.a", "$color.a"],
    });
  });

  it("should return two tokens that reference each other", () => {
    const graph = createGraph(
      ["$color.a", { light: "$color.b" }],
      ["$color.b", { light: "$color.a" }],
    );

    expect(findDependencyCycle(graph)).toEqual({
      mode: "light",
      path: ["$color.a", "$color.b", "$color.a"],
    });
  });

  it("should return only the tokens on the cycle if a chain leads into it", () => {
    const graph = createGraph(
      ["$color.entry", { light: "$color.a" }],
      ["$color.a", { light: "$color.b" }],
      ["$color.b", { light: "$color.c" }],
      ["$color.c", { light: "$color.a" }],
    );

    expect(findDependencyCycle(graph)).toEqual({
      mode: "light",
      path: ["$color.a", "$color.b", "$color.c", "$color.a"],
    });
  });

  it("should return the mode in which the cycle occurs", () => {
    const graph = createGraph(
      ["$color.a", { light: "$color.palette", dark: "$color.b" }],
      ["$color.b", { dark: "$color.a" }],
    );

    expect(findDependencyCycle(graph)).toEqual({
      mode: "dark",
      path: ["$color.a", "$color.b", "$color.a"],
    });
  });
});
