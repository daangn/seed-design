import { describe, expect, test } from "bun:test";

import type { FetchImpl } from "../knowledge/fetch";
import { loadGuidelineDocIds } from "../knowledge/guideline-docs";

const BASE_URL = "https://seed-design.io";

function stubFetch(body: unknown | null) {
  return (async () => {
    if (body === null) return new Response("nope", { status: 404, statusText: "Not Found" });
    return new Response(JSON.stringify(body), { status: 200 });
  }) as unknown as FetchImpl;
}

describe("loadGuidelineDocIds", () => {
  test("Design 카테고리의 components 섹션에서 id를 모은다", async () => {
    const ids = await loadGuidelineDocIds({
      baseUrl: BASE_URL,
      fetchImpl: stubFetch({
        categories: [
          {
            id: "docs",
            sections: [
              { id: "components", items: [{ id: "bottom-sheet" }, { id: "action-button" }] },
              { id: "migration", items: [{ id: "deprecations" }] },
            ],
          },
          // react 카테고리의 components는 API 문서라 가이드라인이 아니다
          { id: "react", sections: [{ id: "components", items: [{ id: "chip-tabs" }] }] },
        ],
      }),
    });

    expect(ids).toEqual(new Set(["bottom-sheet", "action-button"]));
  });

  test("인덱스를 못 가져오면 빈 집합 — 진단 전체를 실패시키지 않는다", async () => {
    const ids = await loadGuidelineDocIds({ baseUrl: BASE_URL, fetchImpl: stubFetch(null) });

    expect(ids).toEqual(new Set());
  });

  test("components 섹션이 없으면 빈 집합", async () => {
    const ids = await loadGuidelineDocIds({
      baseUrl: BASE_URL,
      fetchImpl: stubFetch({ categories: [{ id: "docs", sections: [] }] }),
    });

    expect(ids).toEqual(new Set());
  });
});
