import { describe, expect, it } from "bun:test";
import { type ComponentSearchEntry, matchComponents } from "./component-search";

function entry(title: string, overrides: Partial<ComponentSearchEntry> = {}): ComponentSearchEntry {
  const slug = title.toLowerCase().replace(/\s+/g, "-");
  return {
    slug,
    title,
    url: `/components/${slug}`,
    thumbnail: `/og/components/${slug}.webp`,
    components: [
      {
        name: title,
        platforms: [{ key: "figma" }, { key: "react", url: `/react/components/${slug}` }],
      },
    ],
    ...overrides,
  };
}

const ENTRIES = [
  entry("Action Button", {
    description: "명확한 액션을 쉽게 수행할 수 있도록 돕는 기본 인터랙션 컴포넌트입니다.",
  }),
  entry("Bottom Sheet"),
  entry("Callout", { description: "사용자에게 중요한 안내를 전달하는 컴포넌트입니다." }),
  entry("Floating Action Button"),
  entry("Input Button"),
  entry("List", { slug: "list", url: "/components/list" }),
];

const titles = (search: string) => matchComponents(ENTRIES, search).map(({ title }) => title);

describe("matchComponents", () => {
  it("returns nothing for a blank query", () => {
    expect(matchComponents(ENTRIES, "   ")).toEqual([]);
  });

  it("puts an exact name first, however the separators were typed", () => {
    expect(titles("Action Button")[0]).toBe("Action Button");
    expect(titles("action-button")[0]).toBe("Action Button");
  });

  it("ranks a component the query names ahead of one that only ends in it", () => {
    // "action" opens Action Button but merely qualifies Floating Action Button.
    expect(titles("action")).toEqual(["Action Button", "Floating Action Button"]);
  });

  it("gathers every component named after the same word", () => {
    expect(titles("button")).toEqual(["Input Button", "Action Button", "Floating Action Button"]);
  });

  it("matches a name typed as one word", () => {
    expect(titles("bottomsheet")).toEqual(["Bottom Sheet"]);
  });

  it("matches terms in any order", () => {
    expect(titles("button floating")).toEqual(["Floating Action Button"]);
  });

  it("falls back to the Korean description", () => {
    expect(titles("안내")).toEqual(["Callout"]);
  });

  it("prefers the name over the description when both match", () => {
    expect(titles("액션")).toEqual(["Action Button"]);
    expect(titles("list")[0]).toBe("List");
  });

  it("ignores components nothing in the query points at", () => {
    expect(titles("carousel")).toEqual([]);
  });
});
