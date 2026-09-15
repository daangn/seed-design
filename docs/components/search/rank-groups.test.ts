import { describe, expect, it } from "bun:test";
import { type RankedResult, rankGroups } from "./rank-groups";

/** The query reaches the second page only through its when-to-read line, which ranks unlisted. */
const RESULTS: RankedResult[] = [
  { id: "/spacing", type: "page", url: "/spacing", content: "Spacing" },
  { id: "/spacing-0", type: "text", url: "/spacing", content: "요소 사이 간격" },
  { id: "/layout", type: "page", url: "/layout", content: "Layout" },
  {
    id: "/layout-0",
    type: "text",
    url: "/layout",
    content: "그리드의 컬럼·<mark>거터</mark>·마진을 정할 때 읽는다.",
    rankOnly: true,
  },
];

const pagesOf = ({ rows }: ReturnType<typeof rankGroups>) =>
  rows.filter(({ type }) => type === "page").map(({ id }) => id);

describe("rankGroups", () => {
  it("lifts the page a rank-only row belongs to, and leaves the row off the list", () => {
    const { rows, nested } = rankGroups(RESULTS, "거터");

    expect(rows.map(({ id }) => id)).toEqual(["/layout", "/spacing", "/spacing-0"]);
    expect([...nested]).toEqual(["/spacing-0"]);
  });

  it("orders pages as it would with the row listed", () => {
    const shown = RESULTS.map((row) => ({ ...row, rankOnly: false }));

    expect(pagesOf(rankGroups(RESULTS, "거터"))).toEqual(pagesOf(rankGroups(shown, "거터")));
  });

  it("drops a rank-only row with no page ahead of it", () => {
    expect(rankGroups(RESULTS.slice(3), "거터").rows).toEqual([]);
  });
});
