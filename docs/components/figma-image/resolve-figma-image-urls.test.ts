import { describe, expect, it } from "bun:test";
import { resolveFigmaImageUrls } from "./resolve-figma-image-urls";

describe("resolveFigmaImageUrls", () => {
  it("첫 요청을 최대 50개씩 나눈다", async () => {
    const calls: string[][] = [];
    const allIds = Array.from({ length: 51 }, (_, index) => String(index + 1));

    await resolveFigmaImageUrls({
      nodeIds: allIds,
      retryDelayMs: 0,
      fetchUrls: async (nodeIds) => {
        calls.push(nodeIds);
        return new Map(nodeIds.map((nodeId) => [nodeId, `https://${nodeId}`]));
      },
    });

    expect(calls.map((nodeIds) => nodeIds.length)).toEqual([50, 1]);
  });

  it("누락된 ID만 더 작은 묶음으로 다시 요청한다", async () => {
    const calls: string[][] = [];
    const allIds = Array.from({ length: 12 }, (_, index) => String(index + 1));

    const imageUrls = await resolveFigmaImageUrls({
      nodeIds: allIds,
      retryDelayMs: 0,
      fetchUrls: async (nodeIds) => {
        calls.push(nodeIds);

        if (calls.length === 1) {
          return new Map(nodeIds.slice(0, -2).map((nodeId) => [nodeId, `https://${nodeId}`]));
        }

        if (calls.length === 2) {
          return new Map([[nodeIds[0], `https://${nodeIds[0]}`]]);
        }

        return new Map([[nodeIds[0], `https://${nodeIds[0]}`]]);
      },
    });

    expect(calls).toEqual([allIds, ["11", "12"], ["12"]]);
    expect(imageUrls.size).toBe(allIds.length);
  });

  it("첫 응답이 완전하면 추가 요청하지 않는다", async () => {
    let callCount = 0;

    const imageUrls = await resolveFigmaImageUrls({
      nodeIds: ["1", "2"],
      retryDelayMs: 0,
      fetchUrls: async (nodeIds) => {
        callCount++;
        return new Map(nodeIds.map((nodeId) => [nodeId, `https://${nodeId}`]));
      },
    });

    expect(callCount).toBe(1);
    expect([...imageUrls.keys()]).toEqual(["1", "2"]);
  });

  it("개별 재시도 후에도 확인할 수 없는 ID는 결과에서 제외한다", async () => {
    const calls: string[][] = [];

    const imageUrls = await resolveFigmaImageUrls({
      nodeIds: ["missing-1", "missing-2"],
      retryDelayMs: 0,
      fetchUrls: async (nodeIds) => {
        calls.push(nodeIds);
        return new Map();
      },
    });

    expect(calls).toEqual([
      ["missing-1", "missing-2"],
      ["missing-1", "missing-2"],
      ["missing-1"],
      ["missing-2"],
    ]);
    expect(imageUrls.size).toBe(0);
  });
});
