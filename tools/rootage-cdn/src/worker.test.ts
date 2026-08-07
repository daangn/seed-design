import { describe, expect, test } from "bun:test";
import { jsonBytes, sha256 } from "./contract";
import { handleRequest, type WorkerEnv } from "./worker";

async function fixture(): Promise<WorkerEnv> {
  const resource = jsonBytes({ version: "1.2.3" });
  const resourceSha = await sha256(resource);
  const manifest = jsonBytes({
    schemaVersion: 1,
    package: "@seed-design/rootage-artifacts",
    version: "1.2.3",
    npmIntegrity: `sha512-${"A".repeat(86)}==`,
    gitHead: "b".repeat(40),
    files: [
      {
        path: "/index.json",
        key: "versions/v1.2.3/index.json",
        bytes: resource.byteLength,
        sha256: resourceSha,
      },
    ],
  });
  const pointer = jsonBytes({
    schemaVersion: 1,
    version: "1.2.3",
    manifestSha256: await sha256(manifest),
    npmIntegrity: `sha512-${"A".repeat(86)}==`,
  });
  const objects = new Map([
    ["versions/v1.2.3/index.json", resource],
    ["manifests/v1.2.3.json", manifest],
    ["pointers/stable.json", pointer],
  ]);
  return {
    ROOTAGE_BUCKET: {
      async get(key) {
        const bytes = objects.get(key);
        return bytes
          ? {
              body: new Response(bytes.slice().buffer).body!,
              async arrayBuffer() {
                return bytes.slice().buffer;
              },
            }
          : null;
      },
      async head(key) {
        return objects.has(key) ? {} : null;
      },
    },
  };
}

describe("Rootage Worker", () => {
  test("불변 버전과 latest를 제공한다", async () => {
    const env = await fixture();
    const version = await handleRequest(
      new Request("https://seed-design.io/rootage/v1.2.3/index.json"),
      env,
    );
    expect(version.status).toBe(200);
    expect(version.headers.get("cache-control")).toContain("immutable");
    const latest = await handleRequest(
      new Request("https://seed-design.io/rootage/latest/index.json"),
      env,
    );
    expect(latest.status).toBe(200);
    expect(latest.headers.get("cache-control")).toBe("no-cache");
  });

  test("ETag 재검증과 누락 객체 fail-closed를 적용한다", async () => {
    const env = await fixture();
    const first = await handleRequest(
      new Request("https://seed-design.io/rootage/v1.2.3/index.json"),
      env,
    );
    const cached = await handleRequest(
      new Request("https://seed-design.io/rootage/v1.2.3/index.json", {
        headers: { "if-none-match": first.headers.get("etag")! },
      }),
      env,
    );
    expect(cached.status).toBe(304);
    env.ROOTAGE_BUCKET.get = async () => null;
    expect(
      (await handleRequest(new Request("https://seed-design.io/rootage/v1.2.3/index.json"), env))
        .status,
    ).toBe(404);
  });
});
