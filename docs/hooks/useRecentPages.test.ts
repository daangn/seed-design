import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "bun:test";
import { parseRecentPages, recordRecentPage, useRecentPages } from "./useRecentPages";

const STORAGE_KEY = "seed-docs-recent";
const readStored = () => parseRecentPages(window.localStorage.getItem(STORAGE_KEY));

describe("parseRecentPages", () => {
  it("returns [] for null, malformed JSON, or a non-array payload", () => {
    expect(parseRecentPages(null)).toEqual([]);
    expect(parseRecentPages("{ not json")).toEqual([]);
    expect(parseRecentPages('{"url":"/x"}')).toEqual([]);
  });

  it("keeps a valid internal entry and derives its section", () => {
    const raw = JSON.stringify([
      { url: "/components/action-button", title: "Action Button", ts: 1 },
    ]);
    const pages = parseRecentPages(raw);
    expect(pages).toHaveLength(1);
    expect(pages[0]).toMatchObject({
      url: "/components/action-button",
      title: "Action Button",
      section: "Components",
      ts: 1,
    });
  });

  it("drops entries whose url is external, protocol-relative, or not a string", () => {
    const raw = JSON.stringify([
      { url: "https://evil.example/x", title: "External", ts: 1 },
      { url: "//evil.example/x", title: "Protocol relative", ts: 1 },
      { url: 42, title: "Non string", ts: 1 },
    ]);
    expect(parseRecentPages(raw)).toEqual([]);
  });

  it("drops entries with an empty title or a non-finite/non-number ts", () => {
    const raw = JSON.stringify([
      { url: "/a", title: "   ", ts: 1 },
      { url: "/b", title: "B", ts: Number.NaN },
      { url: "/c", title: "C", ts: "1" },
    ]);
    expect(parseRecentPages(raw)).toEqual([]);
  });

  it("caps the list at 6 items", () => {
    const raw = JSON.stringify(
      Array.from({ length: 10 }, (_, i) => ({ url: `/p${i}`, title: `P${i}`, ts: i })),
    );
    expect(parseRecentPages(raw)).toHaveLength(6);
  });
});

describe("recordRecentPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.title = "";
  });

  it("is a no-op on the landing route and on an empty pathname", () => {
    recordRecentPage("/");
    recordRecentPage("");
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("records a visit, stripping the ' | SEED Design' title suffix", () => {
    document.title = "Action Button | SEED Design";
    recordRecentPage("/components/action-button");
    const pages = readStored();
    expect(pages).toHaveLength(1);
    expect(pages[0]).toMatchObject({ url: "/components/action-button", title: "Action Button" });
  });

  it("includes the query string in the stored url", () => {
    recordRecentPage("/foundations/color", "tab=tokens");
    expect(readStored()[0]?.url).toBe("/foundations/color?tab=tokens");
  });

  it("dedupes by url, moving the repeat visit to the front", () => {
    recordRecentPage("/a");
    recordRecentPage("/b");
    recordRecentPage("/a");
    expect(readStored().map((p) => p.url)).toEqual(["/a", "/b"]);
  });

  it("keeps only the 6 most recent visits", () => {
    for (let i = 0; i < 8; i++) recordRecentPage(`/p${i}`);
    const pages = readStored();
    expect(pages).toHaveLength(6);
    expect(pages[0]?.url).toBe("/p7");
    expect(pages.at(-1)?.url).toBe("/p2");
  });
});

describe("useRecentPages", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.title = "";
  });

  it("starts empty and updates when a page is recorded", () => {
    const { result } = renderHook(() => useRecentPages());
    expect(result.current).toEqual([]);
    act(() => recordRecentPage("/components/action-button"));
    expect(result.current).toHaveLength(1);
    expect(result.current[0]?.url).toBe("/components/action-button");
  });
});
