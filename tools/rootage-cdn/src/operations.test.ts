import { describe, expect, test } from "bun:test";
import { jsonBytes, sha256 } from "./contract";
import { ROOTAGE_WORKER_VERSION_HEADER } from "./deployment-metadata";
import {
  cleanupCompletedSnapshots,
  cleanupIncompleteVersions,
  type FetchImplementation,
  setStablePointer,
  updateWorkerRoute,
  verifyWorkerRoutePublic,
} from "./operations";
import { createRootageSnapshotVersion } from "./snapshot";
import type { ObjectStore, StoredObject } from "./types";

class MemoryStore implements ObjectStore {
  objects = new Map<string, StoredObject>();
  uploaded = new Map<string, Date>();
  deleted: string[] = [];
  async get(key: string) {
    return this.objects.get(key) ?? null;
  }
  async putIfAbsent(key: string, bytes: Uint8Array, checksum: string) {
    if (this.objects.has(key)) return { status: "precondition-failed" as const };
    this.objects.set(key, { bytes, etag: `etag-${checksum}`, sha256: checksum });
    return { status: "created" as const, etag: `etag-${checksum}` };
  }
  async putIfMatch(key: string, bytes: Uint8Array, checksum: string, etag: string) {
    if (this.objects.get(key)?.etag !== etag) return { status: "precondition-failed" as const };
    this.objects.set(key, { bytes, etag: `etag-${checksum}`, sha256: checksum });
    return { status: "created" as const, etag: `etag-${checksum}` };
  }
  async list(prefix: string) {
    return [...this.uploaded]
      .filter(([key]) => key.startsWith(prefix))
      .map(([key, uploaded]) => ({ key, uploaded }));
  }
  async delete(key: string) {
    this.deleted.push(key);
    this.objects.delete(key);
  }
}

const integrity = `sha512-${"A".repeat(86)}==`;

describe("Rootage 운영 명령", () => {
  test("stable rollback도 현재 ETag와 예상 버전을 확인한다", async () => {
    const store = new MemoryStore();
    const manifest = jsonBytes({
      schemaVersion: 1,
      package: "@seed-design/rootage-artifacts",
      version: "1.0.0",
      npmIntegrity: integrity,
      gitHead: "b".repeat(40),
      files: [
        {
          path: "/index.json",
          key: "versions/v1.0.0/index.json",
          bytes: 2,
          sha256: "a".repeat(64),
        },
      ],
    });
    store.objects.set("manifests/v1.0.0.json", { bytes: manifest, etag: "manifest" });
    const pointer = jsonBytes({
      schemaVersion: 1,
      version: "2.0.0",
      manifestSha256: "c".repeat(64),
      npmIntegrity: integrity,
    });
    store.objects.set("pointers/stable.json", { bytes: pointer, etag: "current" });
    expect(
      await setStablePointer(store, "1.0.0", { expectedCurrent: "2.0.0", allowRollback: true }),
    ).toEqual({ before: "2.0.0", after: "1.0.0" });
    expect(
      JSON.parse(new TextDecoder().decode(store.objects.get("pointers/stable.json")!.bytes))
        .manifestSha256,
    ).toBe(await sha256(manifest));
  });

  test("stable rollback 후 latest 검증 실패 시 원래 포인터를 복원한다", async () => {
    const store = new MemoryStore();
    const manifest = jsonBytes({
      schemaVersion: 1,
      package: "@seed-design/rootage-artifacts",
      version: "1.0.0",
      npmIntegrity: integrity,
      gitHead: "b".repeat(40),
      files: [
        {
          path: "/index.json",
          key: "versions/v1.0.0/index.json",
          bytes: 2,
          sha256: "a".repeat(64),
        },
      ],
    });
    store.objects.set("manifests/v1.0.0.json", { bytes: manifest, etag: "manifest" });
    const original = jsonBytes({
      schemaVersion: 1,
      version: "2.0.0",
      manifestSha256: "c".repeat(64),
      npmIntegrity: integrity,
    });
    store.objects.set("pointers/stable.json", { bytes: original, etag: "current" });

    await expect(
      setStablePointer(store, "1.0.0", {
        expectedCurrent: "2.0.0",
        allowRollback: true,
        verifyLatest: async () => {
          throw new Error("public mismatch");
        },
      }),
    ).rejects.toThrow("이전 stable 포인터로 자동 rollback했습니다");
    expect(store.objects.get("pointers/stable.json")?.bytes).toEqual(original);
  });

  test("완료 manifest가 없는 오래된 버전만 정리한다", async () => {
    const store = new MemoryStore();
    store.uploaded.set("versions/v0.9.0/index.json", new Date(0));
    store.uploaded.set("versions/v1.0.0/index.json", new Date(0));
    store.objects.set("manifests/v1.0.0.json", { bytes: new Uint8Array(), etag: "complete" });
    const report = await cleanupIncompleteVersions(store, { olderThanDays: 7, apply: false });
    expect(report.candidates).toEqual(["0.9.0"]);
    await cleanupIncompleteVersions(store, { olderThanDays: 7, apply: true });
    expect(store.deleted).toEqual(["versions/v0.9.0/index.json"]);
  });

  test("닫힌 지 30일 지난 완료 snapshot만 manifest부터 정리한다", async () => {
    const store = new MemoryStore();
    const oldSourceSha = "1".repeat(40);
    const recentSourceSha = "2".repeat(40);
    const openSourceSha = "3".repeat(40);
    const oldVersion = createRootageSnapshotVersion("10", oldSourceSha);
    const recentVersion = createRootageSnapshotVersion("11", recentSourceSha);
    const openVersion = createRootageSnapshotVersion("12", openSourceSha);
    const addSnapshot = (version: string, sourceSha: string) => {
      const key = `manifests/v${version}.json`;
      store.uploaded.set(key, new Date("2026-01-01T00:00:00Z"));
      store.objects.set(key, {
        etag: version,
        bytes: jsonBytes({
          schemaVersion: 1,
          package: "@seed-design/rootage-artifacts",
          version,
          npmIntegrity: integrity,
          gitHead: sourceSha,
          files: [
            {
              path: "/index.json",
              key: `versions/v${version}/index.json`,
              bytes: 2,
              sha256: "a".repeat(64),
            },
          ],
        }),
      });
      store.objects.set(`versions/v${version}/index.json`, {
        etag: version,
        bytes: jsonBytes({}),
      });
    };
    addSnapshot(oldVersion, oldSourceSha);
    addSnapshot(recentVersion, recentSourceSha);
    addSnapshot(openVersion, openSourceSha);
    store.uploaded.set("manifests/v2.4.0.json", new Date(0));

    const states = new Map([
      [10, { state: "closed" as const, closedAt: "2026-06-01T00:00:00Z" }],
      [11, { state: "closed" as const, closedAt: "2026-07-25T00:00:00Z" }],
      [12, { state: "open" as const, closedAt: "2026-05-01T00:00:00Z" }],
    ]);
    const result = await cleanupCompletedSnapshots(store, {
      olderThanDays: 30,
      apply: true,
      now: new Date("2026-08-11T00:00:00Z"),
      getPullRequest: async (prNumber) => states.get(prNumber)!,
    });

    expect(result).toEqual({ candidates: [oldVersion], deleted: 2 });
    expect(store.deleted).toEqual([
      `manifests/v${oldVersion}.json`,
      `versions/v${oldVersion}/index.json`,
    ]);
    expect(store.objects.has(`manifests/v${recentVersion}.json`)).toBe(true);
    expect(store.objects.has(`manifests/v${openVersion}.json`)).toBe(true);
  });

  test("snapshot manifest의 source identity가 버전과 다르면 삭제하지 않는다", async () => {
    const store = new MemoryStore();
    const version = createRootageSnapshotVersion("13", "4".repeat(40));
    const key = `manifests/v${version}.json`;
    store.uploaded.set(key, new Date(0));
    store.objects.set(key, {
      etag: "manifest",
      bytes: jsonBytes({
        schemaVersion: 1,
        package: "@seed-design/rootage-artifacts",
        version,
        npmIntegrity: integrity,
        gitHead: "5".repeat(40),
        files: [
          {
            path: "/index.json",
            key: `versions/v${version}/index.json`,
            bytes: 2,
            sha256: "a".repeat(64),
          },
        ],
      }),
    });

    await expect(
      cleanupCompletedSnapshots(store, {
        olderThanDays: 30,
        apply: true,
        now: new Date("2026-08-11T00:00:00Z"),
        getPullRequest: async () => ({ state: "closed", closedAt: "2026-01-01T00:00:00Z" }),
      }),
    ).rejects.toThrow("identity");
    expect(store.deleted).toEqual([]);
  });

  test("route cutover 후 smoke가 성공해야 생성 완료로 보고한다", async () => {
    const requests: string[] = [];
    const fetchImplementation: FetchImplementation = async (input, init) => {
      const url = String(input);
      const method = init?.method ?? "GET";
      requests.push(`${method} ${url}`);
      if (method === "GET") {
        return Response.json({ success: true, result: [] });
      }
      if (method === "POST") {
        return Response.json({ success: true, result: { id: "route-created" } });
      }
      throw new Error(`unexpected request: ${method} ${url}`);
    };

    await expect(
      updateWorkerRoute(
        {
          zoneId: "zone",
          apiToken: "token",
          script: "seed-design-rootage",
          pattern: "seed-design.io/rootage/*",
          action: "cutover",
          smokeUrl: "https://seed-design.io/rootage/latest/index.json",
        },
        { fetch: fetchImplementation, verifyPublic: async () => {} },
      ),
    ).resolves.toBe("created");
    expect(requests.map((request) => request.split(" ")[0])).toEqual(["GET", "POST"]);
  });

  test("route POST가 적용된 뒤 응답이 유실되거나 non-ok여도 exact route를 재결속한다", async () => {
    for (const failureMode of ["throw", "non-ok"] as const) {
      let currentRoute: Record<string, string> | undefined;
      let smokeCalls = 0;
      const methods: string[] = [];
      const fetchImplementation: FetchImplementation = async (_input, init) => {
        const method = init?.method ?? "GET";
        methods.push(method);
        if (method === "GET") {
          return Response.json({
            success: true,
            result: currentRoute ? [currentRoute] : [],
          });
        }
        if (method === "POST") {
          currentRoute = {
            id: "accepted-route",
            pattern: "seed-design.io/rootage/*",
            script: "seed-design-rootage",
          };
          if (failureMode === "throw") throw new Error("response lost");
          return new Response("upstream response lost", { status: 502 });
        }
        throw new Error(`unexpected method: ${method}`);
      };

      await expect(
        updateWorkerRoute(
          {
            zoneId: "zone",
            apiToken: "token",
            script: "seed-design-rootage",
            pattern: "seed-design.io/rootage/*",
            action: "cutover",
            smokeUrl: "https://seed-design.io/rootage/latest/index.json",
          },
          {
            fetch: fetchImplementation,
            verifyPublic: async () => {
              smokeCalls += 1;
            },
          },
        ),
      ).resolves.toBe("created");
      expect(methods).toEqual(["GET", "POST", "GET"]);
      expect(smokeCalls).toBe(1);
    }
  });

  test("route POST 응답 유실 뒤 route가 absent면 safe not-applied로 실패한다", async () => {
    let smokeCalls = 0;
    const fetchImplementation: FetchImplementation = async (_input, init) => {
      if ((init?.method ?? "GET") === "POST") throw new Error("response lost before apply");
      return Response.json({ success: true, result: [] });
    };

    await expect(
      updateWorkerRoute(
        {
          zoneId: "zone",
          apiToken: "token",
          script: "seed-design-rootage",
          pattern: "seed-design.io/rootage/*",
          action: "cutover",
          smokeUrl: "https://seed-design.io/rootage/latest/index.json",
        },
        {
          fetch: fetchImplementation,
          verifyPublic: async () => {
            smokeCalls += 1;
          },
          mutationReconciliation: { attempts: 1, delayMs: 0 },
        },
      ),
    ).rejects.toThrow("absent 상태를 유지");
    expect(smokeCalls).toBe(0);
  });

  test("route POST 응답 유실 뒤 exact route가 늦게 보이면 bounded retry한다", async () => {
    let accepted = false;
    let reconciliationReads = 0;
    const sleeps: number[] = [];
    const fetchImplementation: FetchImplementation = async (_input, init) => {
      const method = init?.method ?? "GET";
      if (method === "POST") {
        accepted = true;
        throw new Error("response lost");
      }
      if (accepted) reconciliationReads += 1;
      return Response.json({
        success: true,
        result:
          reconciliationReads >= 2
            ? [
                {
                  id: "accepted-route",
                  pattern: "seed-design.io/rootage/*",
                  script: "seed-design-rootage",
                },
              ]
            : [],
      });
    };

    await expect(
      updateWorkerRoute(
        {
          zoneId: "zone",
          apiToken: "token",
          script: "seed-design-rootage",
          pattern: "seed-design.io/rootage/*",
          action: "cutover",
          smokeUrl: "https://seed-design.io/rootage/latest/index.json",
        },
        {
          fetch: fetchImplementation,
          verifyPublic: async () => {},
          mutationReconciliation: {
            attempts: 2,
            delayMs: 7,
            sleep: async (milliseconds) => {
              sleeps.push(milliseconds);
            },
          },
        },
      ),
    ).resolves.toBe("created");
    expect(sleeps).toEqual([7]);
  });

  test("route POST 응답 유실 뒤 다른 owner가 보이면 fail closed한다", async () => {
    let currentRoute: Record<string, string> | undefined;
    const fetchImplementation: FetchImplementation = async (_input, init) => {
      const method = init?.method ?? "GET";
      if (method === "GET") {
        return Response.json({ success: true, result: currentRoute ? [currentRoute] : [] });
      }
      currentRoute = {
        id: "concurrent-route",
        pattern: "seed-design.io/rootage/*",
        script: "other-worker",
      };
      throw new Error("response lost");
    };

    await expect(
      updateWorkerRoute(
        {
          zoneId: "zone",
          apiToken: "token",
          script: "seed-design-rootage",
          pattern: "seed-design.io/rootage/*",
          action: "cutover",
          smokeUrl: "https://seed-design.io/rootage/latest/index.json",
        },
        { fetch: fetchImplementation, verifyPublic: async () => {} },
      ),
    ).rejects.toBeInstanceOf(AggregateError);
  });

  test("public smoke는 고정 URL에서 stable index 계약을 확인한다", async () => {
    let requestedUrl = "";
    await verifyWorkerRoutePublic(
      "https://seed-design.io/rootage/latest/index.json",
      async (input) => {
        requestedUrl = String(input);
        return Response.json({
          version: "2.4.0",
          resources: [{ path: "/color.json" }],
        });
      },
    );
    expect(requestedUrl).toStartWith(
      "https://seed-design.io/rootage/latest/index.json?route-smoke=",
    );
    await expect(
      verifyWorkerRoutePublic("https://attacker.invalid/rootage/latest/index.json"),
    ).rejects.toThrow("허용된 Rootage route smoke URL");
  });

  test("production deploy smoke는 exact Worker version header를 요구한다", async () => {
    const expectedVersionId = "77777777-7777-7777-7777-777777777777";
    const payload = { version: "2.4.0", resources: [{ path: "/color.json" }] };
    await expect(
      verifyWorkerRoutePublic(
        "https://seed-design.io/rootage/latest/index.json",
        async () =>
          Response.json(payload, {
            headers: { [ROOTAGE_WORKER_VERSION_HEADER]: expectedVersionId },
          }),
        { expectedWorkerVersionId: expectedVersionId, attempts: 1 },
      ),
    ).resolves.toBeUndefined();

    await expect(
      verifyWorkerRoutePublic(
        "https://seed-design.io/rootage/latest/index.json",
        async () =>
          Response.json(payload, {
            headers: {
              [ROOTAGE_WORKER_VERSION_HEADER]: "88888888-8888-8888-8888-888888888888",
            },
          }),
        { expectedWorkerVersionId: expectedVersionId, attempts: 1 },
      ),
    ).rejects.toThrow("공개 smoke 검증");
  });

  test("route rollback 대상이 없어도 고정 public fallback을 smoke한다", async () => {
    const verified: string[] = [];
    const fetchImplementation: FetchImplementation = async () =>
      Response.json({ success: true, result: [] });

    await expect(
      updateWorkerRoute(
        {
          zoneId: "zone",
          apiToken: "token",
          script: "seed-design-rootage",
          pattern: "seed-design.io/rootage/*",
          action: "rollback",
          smokeUrl: "https://seed-design.io/rootage/latest/index.json",
        },
        {
          fetch: fetchImplementation,
          verifyPublic: async (url) => {
            verified.push(url);
          },
        },
      ),
    ).resolves.toBe("unchanged");
    expect(verified).toEqual(["https://seed-design.io/rootage/latest/index.json"]);

    await expect(
      updateWorkerRoute(
        {
          zoneId: "zone",
          apiToken: "token",
          script: "seed-design-rootage",
          pattern: "seed-design.io/rootage/*",
          action: "rollback",
          smokeUrl: undefined as unknown as string,
        },
        { fetch: fetchImplementation, verifyPublic: async () => {} },
      ),
    ).rejects.toThrow("고정된 public smoke URL");
  });

  test("route rollback은 삭제 뒤 public fallback smoke가 성공해야 완료한다", async () => {
    const requests: string[] = [];
    const verified: string[] = [];
    const fetchImplementation: FetchImplementation = async (input, init) => {
      const method = init?.method ?? "GET";
      requests.push(`${method} ${String(input)}`);
      if (method === "GET") {
        return Response.json({
          success: true,
          result: [
            {
              id: "existing-route",
              pattern: "seed-design.io/rootage/*",
              script: "seed-design-rootage",
            },
          ],
        });
      }
      if (method === "DELETE") return new Response(null, { status: 204 });
      throw new Error(`unexpected method: ${method}`);
    };

    await expect(
      updateWorkerRoute(
        {
          zoneId: "zone",
          apiToken: "token",
          script: "seed-design-rootage",
          pattern: "seed-design.io/rootage/*",
          action: "rollback",
          smokeUrl: "https://seed-design.io/rootage/latest/index.json",
        },
        {
          fetch: fetchImplementation,
          verifyPublic: async (url) => {
            verified.push(url);
          },
        },
      ),
    ).resolves.toBe("deleted");
    expect(requests.map((request) => request.split(" ")[0])).toEqual(["GET", "DELETE"]);
    expect(verified).toEqual(["https://seed-design.io/rootage/latest/index.json"]);
  });

  test("route DELETE가 적용된 뒤 응답이 유실되거나 non-ok여도 absent를 재결속한다", async () => {
    for (const failureMode of ["throw", "non-ok"] as const) {
      let currentRoute: Record<string, string> | undefined = {
        id: "existing-route",
        pattern: "seed-design.io/rootage/*",
        script: "seed-design-rootage",
      };
      let smokeCalls = 0;
      const methods: string[] = [];
      const fetchImplementation: FetchImplementation = async (_input, init) => {
        const method = init?.method ?? "GET";
        methods.push(method);
        if (method === "GET") {
          return Response.json({ success: true, result: currentRoute ? [currentRoute] : [] });
        }
        if (method === "DELETE") {
          currentRoute = undefined;
          if (failureMode === "throw") throw new Error("response lost");
          return new Response("upstream response lost", { status: 502 });
        }
        throw new Error(`unexpected method: ${method}`);
      };

      await expect(
        updateWorkerRoute(
          {
            zoneId: "zone",
            apiToken: "token",
            script: "seed-design-rootage",
            pattern: "seed-design.io/rootage/*",
            action: "rollback",
            smokeUrl: "https://seed-design.io/rootage/latest/index.json",
          },
          {
            fetch: fetchImplementation,
            verifyPublic: async () => {
              smokeCalls += 1;
            },
          },
        ),
      ).resolves.toBe("deleted");
      expect(methods).toEqual(["GET", "DELETE", "GET"]);
      expect(smokeCalls).toBe(1);
    }
  });

  test("route DELETE 응답 유실 뒤 exact route가 남으면 safe not-applied로 실패한다", async () => {
    let smokeCalls = 0;
    const route = {
      id: "existing-route",
      pattern: "seed-design.io/rootage/*",
      script: "seed-design-rootage",
    };
    const fetchImplementation: FetchImplementation = async (_input, init) => {
      if ((init?.method ?? "GET") === "DELETE") throw new Error("response lost before apply");
      return Response.json({ success: true, result: [route] });
    };

    await expect(
      updateWorkerRoute(
        {
          zoneId: "zone",
          apiToken: "token",
          script: "seed-design-rootage",
          pattern: "seed-design.io/rootage/*",
          action: "rollback",
          smokeUrl: "https://seed-design.io/rootage/latest/index.json",
        },
        {
          fetch: fetchImplementation,
          verifyPublic: async () => {
            smokeCalls += 1;
          },
          mutationReconciliation: { attempts: 1, delayMs: 0 },
        },
      ),
    ).rejects.toThrow("exact 기존 route를 유지");
    expect(smokeCalls).toBe(0);
  });

  test("route DELETE 응답 유실 뒤 owner ID가 바뀌면 fail closed한다", async () => {
    let currentRoute = {
      id: "existing-route",
      pattern: "seed-design.io/rootage/*",
      script: "seed-design-rootage",
    };
    const fetchImplementation: FetchImplementation = async (_input, init) => {
      if ((init?.method ?? "GET") === "DELETE") {
        currentRoute = { ...currentRoute, id: "concurrent-route" };
        throw new Error("response lost");
      }
      return Response.json({ success: true, result: [currentRoute] });
    };

    await expect(
      updateWorkerRoute(
        {
          zoneId: "zone",
          apiToken: "token",
          script: "seed-design-rootage",
          pattern: "seed-design.io/rootage/*",
          action: "rollback",
          smokeUrl: "https://seed-design.io/rootage/latest/index.json",
        },
        { fetch: fetchImplementation, verifyPublic: async () => {} },
      ),
    ).rejects.toBeInstanceOf(AggregateError);
  });

  test("route 삭제 후 fallback smoke 실패는 exact route를 복원하고 다시 smoke한다", async () => {
    const methods: string[] = [];
    const postBodies: string[] = [];
    let listCount = 0;
    let smokeCount = 0;
    const fetchImplementation: FetchImplementation = async (_input, init) => {
      const method = init?.method ?? "GET";
      methods.push(method);
      if (method === "GET") {
        listCount += 1;
        return Response.json({
          success: true,
          result:
            listCount === 1
              ? [
                  {
                    id: "existing-route",
                    pattern: "seed-design.io/rootage/*",
                    script: "seed-design-rootage",
                  },
                ]
              : [],
        });
      }
      if (method === "DELETE") return new Response(null, { status: 204 });
      if (method === "POST") {
        postBodies.push(String(init?.body));
        return Response.json({ success: true, result: { id: "restored-route" } });
      }
      throw new Error(`unexpected method: ${method}`);
    };

    await expect(
      updateWorkerRoute(
        {
          zoneId: "zone",
          apiToken: "token",
          script: "seed-design-rootage",
          pattern: "seed-design.io/rootage/*",
          action: "rollback",
          smokeUrl: "https://seed-design.io/rootage/latest/index.json",
        },
        {
          fetch: fetchImplementation,
          verifyPublic: async () => {
            smokeCount += 1;
            if (smokeCount === 1) throw new Error("fallback missing");
          },
        },
      ),
    ).rejects.toThrow("exact route를 복원했습니다");
    expect(methods).toEqual(["GET", "DELETE", "GET", "POST"]);
    expect(postBodies).toEqual([
      JSON.stringify({
        pattern: "seed-design.io/rootage/*",
        script: "seed-design-rootage",
      }),
    ]);
    expect(smokeCount).toBe(2);
  });

  test("route 삭제 뒤 같은 pattern을 다른 Worker가 선점하면 자동 복원하지 않는다", async () => {
    const methods: string[] = [];
    let listCount = 0;
    const fetchImplementation: FetchImplementation = async (_input, init) => {
      const method = init?.method ?? "GET";
      methods.push(method);
      if (method === "GET") {
        listCount += 1;
        return Response.json({
          success: true,
          result: [
            {
              id: listCount === 1 ? "existing-route" : "concurrent-route",
              pattern: "seed-design.io/rootage/*",
              script: listCount === 1 ? "seed-design-rootage" : "other-worker",
            },
          ],
        });
      }
      if (method === "DELETE") return new Response(null, { status: 204 });
      throw new Error(`unexpected method: ${method}`);
    };

    await expect(
      updateWorkerRoute(
        {
          zoneId: "zone",
          apiToken: "token",
          script: "seed-design-rootage",
          pattern: "seed-design.io/rootage/*",
          action: "rollback",
          smokeUrl: "https://seed-design.io/rootage/latest/index.json",
        },
        {
          fetch: fetchImplementation,
          verifyPublic: async () => {
            throw new Error("fallback missing");
          },
        },
      ),
    ).rejects.toBeInstanceOf(AggregateError);
    expect(methods).toEqual(["GET", "DELETE", "GET"]);
  });

  test("route 복원 뒤 smoke도 실패하면 두 실패를 AggregateError로 보존한다", async () => {
    let listCount = 0;
    const fetchImplementation: FetchImplementation = async (_input, init) => {
      const method = init?.method ?? "GET";
      if (method === "GET") {
        listCount += 1;
        return Response.json({
          success: true,
          result:
            listCount === 1
              ? [
                  {
                    id: "existing-route",
                    pattern: "seed-design.io/rootage/*",
                    script: "seed-design-rootage",
                  },
                ]
              : [],
        });
      }
      if (method === "DELETE") return new Response(null, { status: 204 });
      if (method === "POST") {
        return Response.json({ success: true, result: { id: "restored-route" } });
      }
      throw new Error(`unexpected method: ${method}`);
    };

    let caught: unknown;
    try {
      await updateWorkerRoute(
        {
          zoneId: "zone",
          apiToken: "token",
          script: "seed-design-rootage",
          pattern: "seed-design.io/rootage/*",
          action: "rollback",
          smokeUrl: "https://seed-design.io/rootage/latest/index.json",
        },
        {
          fetch: fetchImplementation,
          verifyPublic: async () => {
            throw new Error("public mismatch");
          },
        },
      );
    } catch (error) {
      caught = error;
    }
    expect(caught).toBeInstanceOf(AggregateError);
    expect((caught as AggregateError).errors).toHaveLength(2);
  });

  test("이미 존재하던 동일 route의 smoke 실패는 자동 삭제하지 않는다", async () => {
    const methods: string[] = [];
    const fetchImplementation: FetchImplementation = async (_input, init) => {
      methods.push(init?.method ?? "GET");
      return Response.json({
        success: true,
        result: [
          {
            id: "existing-route",
            pattern: "seed-design.io/rootage/*",
            script: "seed-design-rootage",
          },
        ],
      });
    };

    await expect(
      updateWorkerRoute(
        {
          zoneId: "zone",
          apiToken: "token",
          script: "seed-design-rootage",
          pattern: "seed-design.io/rootage/*",
          action: "cutover",
          smokeUrl: "https://seed-design.io/rootage/latest/index.json",
        },
        {
          fetch: fetchImplementation,
          verifyPublic: async () => {
            throw new Error("public mismatch");
          },
        },
      ),
    ).rejects.toThrow("public mismatch");
    expect(methods).toEqual(["GET"]);
  });

  test("route smoke 실패 시 방금 생성한 route ID만 자동 삭제한다", async () => {
    const requests: string[] = [];
    let listCount = 0;
    const fetchImplementation: FetchImplementation = async (input, init) => {
      const url = String(input);
      const method = init?.method ?? "GET";
      requests.push(`${method} ${url}`);
      if (method === "GET") {
        listCount += 1;
        return Response.json({
          success: true,
          result:
            listCount === 1
              ? []
              : [
                  {
                    id: "route-created",
                    pattern: "seed-design.io/rootage/*",
                    script: "seed-design-rootage",
                  },
                ],
        });
      }
      if (method === "POST") {
        return Response.json({ success: true, result: { id: "route-created" } });
      }
      if (method === "DELETE") return new Response(null, { status: 204 });
      throw new Error(`unexpected request: ${method} ${url}`);
    };

    await expect(
      updateWorkerRoute(
        {
          zoneId: "zone",
          apiToken: "token",
          script: "seed-design-rootage",
          pattern: "seed-design.io/rootage/*",
          action: "cutover",
          smokeUrl: "https://seed-design.io/rootage/latest/index.json",
        },
        {
          fetch: fetchImplementation,
          verifyPublic: async () => {
            throw new Error("public mismatch");
          },
        },
      ),
    ).rejects.toThrow("방금 생성한 route를 자동 rollback했습니다");
    expect(requests.at(-1)).toBe(
      "DELETE https://api.cloudflare.com/client/v4/zones/zone/workers/routes/route-created",
    );
  });

  test("route smoke 실패 후 같은 ID의 대상이 바뀌면 자동 삭제하지 않는다", async () => {
    const methods: string[] = [];
    let listCount = 0;
    const fetchImplementation: FetchImplementation = async (_input, init) => {
      const method = init?.method ?? "GET";
      methods.push(method);
      if (method === "GET") {
        listCount += 1;
        return Response.json({
          success: true,
          result:
            listCount === 1
              ? []
              : [
                  {
                    id: "route-created",
                    pattern: "seed-design.io/rootage/*",
                    script: "other-worker",
                  },
                ],
        });
      }
      return Response.json({ success: true, result: { id: "route-created" } });
    };

    await expect(
      updateWorkerRoute(
        {
          zoneId: "zone",
          apiToken: "token",
          script: "seed-design-rootage",
          pattern: "seed-design.io/rootage/*",
          action: "cutover",
          smokeUrl: "https://seed-design.io/rootage/latest/index.json",
        },
        {
          fetch: fetchImplementation,
          verifyPublic: async () => {
            throw new Error("public mismatch");
          },
        },
      ),
    ).rejects.toThrow("자동 rollback을 안전하게 완료하지 못했습니다");
    expect(methods).not.toContain("DELETE");
  });
});
