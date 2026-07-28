import { describe, expect, test } from "bun:test";

import type { FetchImpl } from "../knowledge/fetch";
import { loadRegistryKnowledge } from "../knowledge/registry";
import { loadRootageKnowledge } from "../knowledge/rootage";

/** URL→JSON 매핑으로 fetch를 스텁하고 호출 URL을 기록한다 */
function stubFetch(routes: Record<string, unknown>) {
  const calls: string[] = [];
  const fetchImpl = (async (input: string | URL | Request) => {
    const url = String(input);
    calls.push(url);
    if (url in routes) {
      return new Response(JSON.stringify(routes[url]), { status: 200 });
    }
    return new Response("not found", { status: 404, statusText: "Not Found" });
  }) as FetchImpl;
  return { fetchImpl, calls };
}

describe("loadRootageKnowledge", () => {
  test("컴포넌트 리소스만 순회해 deprecated 메타와 variants를 한 번에 수집한다", async () => {
    const baseUrl = `https://rootage-${Math.random().toString(36).slice(2)}.test`;
    const { fetchImpl, calls } = stubFetch({
      [`${baseUrl}/rootage/index.json`]: {
        resources: [
          { path: "/components/fab.json" },
          { path: "/components/action-button.json" },
          { path: "/color.json" },
        ],
      },
      [`${baseUrl}/rootage/components/fab.json`]: {
        metadata: { id: "fab", name: "Fab", deprecated: "Use contextual-floating-button instead." },
        data: { schema: {} },
      },
      [`${baseUrl}/rootage/components/action-button.json`]: {
        metadata: { id: "action-button", name: "Action Button" },
        data: {
          schema: {
            variants: {
              variant: { values: { brandSolid: {}, ghost: {} } },
              size: { values: { small: {}, medium: {} } },
            },
          },
        },
      },
    });

    const knowledge = await loadRootageKnowledge({ baseUrl, fetchImpl });

    expect(calls).toEqual([
      `${baseUrl}/rootage/index.json`,
      `${baseUrl}/rootage/components/fab.json`,
      `${baseUrl}/rootage/components/action-button.json`,
    ]);
    expect(knowledge.deprecatedComponents).toEqual([
      { id: "fab", name: "Fab", message: "Use contextual-floating-button instead." },
    ]);
    expect(knowledge.componentVariantSpecs).toEqual([
      {
        id: "action-button",
        name: "Action Button",
        variants: { variant: ["brandSolid", "ghost"], size: ["small", "medium"] },
      },
    ]);
  });

  test("같은 baseUrl은 메모이즈되어 fetch를 반복하지 않는다", async () => {
    const baseUrl = `https://rootage-${Math.random().toString(36).slice(2)}.test`;
    const { fetchImpl, calls } = stubFetch({
      [`${baseUrl}/rootage/index.json`]: { resources: [] },
    });

    await loadRootageKnowledge({ baseUrl, fetchImpl });
    await loadRootageKnowledge({ baseUrl, fetchImpl });

    expect(calls).toEqual([`${baseUrl}/rootage/index.json`]);
  });
});

describe("loadRegistryKnowledge", () => {
  test("deprecated 아이템만 수집하고 jsx 경로 후보와 rootage 메시지를 붙인다", async () => {
    const baseUrl = "https://registry.test";
    const { fetchImpl, calls } = stubFetch({
      [`${baseUrl}/__registry__/react/index.json`]: [{ id: "ui" }, { id: "lib" }],
      [`${baseUrl}/__registry__/react/ui/index.json`]: {
        id: "ui",
        items: [
          {
            id: "action-sheet",
            deprecated: true,
            snippets: [{ path: "action-sheet.tsx" }],
          },
          { id: "action-button", snippets: [{ path: "action-button.tsx" }] },
        ],
      },
      [`${baseUrl}/__registry__/react/lib/index.json`]: { id: "lib", items: [] },
    });

    const { deprecatedSnippetItems } = await loadRegistryKnowledge({
      baseUrl,
      framework: "react",
      deprecatedComponents: [
        { id: "action-sheet", name: "Action Sheet", message: "Use menu-sheet instead." },
      ],
      fetchImpl,
    });

    expect(calls[0]).toBe(`${baseUrl}/__registry__/react/index.json`);
    expect(deprecatedSnippetItems).toEqual([
      {
        registryId: "ui",
        itemId: "action-sheet",
        snippetPaths: ["action-sheet.tsx", "action-sheet.jsx"],
        message: "Use menu-sheet instead.",
      },
    ]);
  });

  test("요청 실패는 URL이 포함된 에러로 전파된다", async () => {
    const baseUrl = "https://broken.test";
    const { fetchImpl } = stubFetch({});

    expect(loadRegistryKnowledge({ baseUrl, framework: "react", fetchImpl })).rejects.toThrow(
      `${baseUrl}/__registry__/react/index.json`,
    );
  });
});
