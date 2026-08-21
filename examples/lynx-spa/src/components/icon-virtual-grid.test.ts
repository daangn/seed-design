import { describe, expect, it } from "bun:test";

import { chunkIconEntries, type IconEntry } from "./icon-grid-rows";

function createEntry(name: string): IconEntry {
  return {
    component: (() => null) as IconEntry["component"],
    name,
  };
}

describe("chunkIconEntries", () => {
  it("groups icons into four-column rows while preserving order", () => {
    const rows = chunkIconEntries(
      ["A", "B", "C", "D", "E", "F", "G"].map((name) => createEntry(name)),
      4,
    );

    expect(rows.map((row) => row.map((icon) => icon.name))).toEqual([
      ["A", "B", "C", "D"],
      ["E", "F", "G"],
    ]);
  });
});
