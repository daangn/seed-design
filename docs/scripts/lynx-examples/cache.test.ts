import { describe, expect, it } from "bun:test";
import { createLynxCacheDigest } from "./cache.js";

describe("createLynxCacheDigest", () => {
  it("입력 순서와 무관하게 같은 digest를 만든다", () => {
    const badge = {
      id: "lynx/badge/preview",
      entryKey: "badge/preview",
      sourcePath: "/badge.tsx",
    } as const;
    const button = {
      id: "lynx/action-button/preview",
      entryKey: "action-button/preview",
      sourcePath: "/button.tsx",
    } as const;
    expect(createLynxCacheDigest([badge, button])).toEqual(createLynxCacheDigest([button, badge]));
  });
});
