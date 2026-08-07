import { describe, expect, test } from "bun:test";
import { R2ObjectStore } from "./r2-object-store";

function storeWith(
  fetchImplementation: (...args: Parameters<typeof fetch>) => ReturnType<typeof fetch>,
): R2ObjectStore {
  return new R2ObjectStore({
    accessKeyId: "test-access-key",
    secretAccessKey: "test-secret-key",
    endpoint: "https://example.invalid/rootage",
    fetch: fetchImplementation,
  });
}

describe("R2 조건부 쓰기 어댑터", () => {
  test("If-None-Match와 If-Match를 실제 요청 헤더로 전달한다", async () => {
    const headers: Headers[] = [];
    const store = storeWith(async (_input, init) => {
      headers.push(new Headers(init?.headers));
      return new Response(null, { status: 200, headers: { etag: '"created"' } });
    });
    const bytes = new TextEncoder().encode("{}");
    await store.putIfAbsent("versions/v1.0.0/index.json", bytes, "a".repeat(64));
    await store.putIfMatch("pointers/stable.json", bytes, "b".repeat(64), '"old"');
    expect(headers[0]?.get("if-none-match")).toBe("*");
    expect(headers[1]?.get("if-match")).toBe('"old"');
  });

  test("HTTP 412를 경쟁 조건 결과로 변환한다", async () => {
    const store = storeWith(async () => new Response("Precondition Failed", { status: 412 }));
    const result = await store.putIfAbsent(
      "pointers/stable.json",
      new TextEncoder().encode("{}"),
      "a".repeat(64),
    );
    expect(result).toEqual({ status: "precondition-failed" });
  });
});
