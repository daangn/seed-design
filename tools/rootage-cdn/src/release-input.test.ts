import { describe, expect, test } from "bun:test";
import { resolveRootageIntegrity, selectRootageRelease } from "./release-input";

const sourceSha = "a".repeat(40);
const registryVersion = (
  version: string,
  overrides: Record<string, unknown> = {},
): Record<string, unknown> => ({
  name: "@seed-design/rootage-artifacts",
  version,
  gitHead: sourceSha,
  dist: {
    integrity: "sha512-YWJjZA==",
    tarball: `https://registry.npmjs.org/rootage-artifacts-${version}.tgz`,
  },
  ...overrides,
});

describe("selectRootageRelease", () => {
  test("Rootage가 게시되지 않으면 CDN 계약을 건너뛴다", () => {
    expect(selectRootageRelease('[{"name":"@seed-design/react","version":"2.3.0"}]')).toBeNull();
    expect(selectRootageRelease("")).toBeNull();
  });

  test("정식 Rootage 버전은 stable로 선택한다", () => {
    expect(
      selectRootageRelease('[{"name":"@seed-design/rootage-artifacts","version":"2.5.0"}]'),
    ).toEqual({ stable: true, version: "2.5.0" });
  });

  test("prerelease Rootage 버전은 stable pointer를 갱신하지 않는다", () => {
    expect(
      selectRootageRelease('[{"name":"@seed-design/rootage-artifacts","version":"2.5.0-beta.3"}]'),
    ).toEqual({ stable: false, version: "2.5.0-beta.3" });
  });

  test("중복 Rootage 항목을 거부한다", () => {
    expect(() =>
      selectRootageRelease(
        '[{"name":"@seed-design/rootage-artifacts","version":"2.5.0"},{"name":"@seed-design/rootage-artifacts","version":"2.5.0"}]',
      ),
    ).toThrow("중복");
  });

  test("알 수 없는 JSON 형식과 Rootage build metadata를 거부한다", () => {
    expect(() => selectRootageRelease("{}")).toThrow("배열");
    expect(() =>
      selectRootageRelease('[{"name":"@seed-design/rootage-artifacts","version":"2.5.0+build.1"}]'),
    ).toThrow("Rootage CDN 계약");
  });
});

describe("resolveRootageIntegrity", () => {
  test("npm registry에 exact version과 gitHead가 나타날 때까지 제한적으로 재시도한다", async () => {
    let calls = 0;
    const sleeps: number[] = [];
    const integrity = await resolveRootageIntegrity("2.5.0", sourceSha, {
      attempts: 3,
      delayMs: 10,
      fetchImpl: async () => {
        calls += 1;
        return calls === 1
          ? new Response("not found", { status: 404 })
          : Response.json(registryVersion("2.5.0"));
      },
      sleep: async (milliseconds) => {
        sleeps.push(milliseconds);
      },
    });

    expect(integrity).toBe("sha512-YWJjZA==");
    expect(calls).toBe(2);
    expect(sleeps).toEqual([10]);
  });

  test("transport와 잘못된 JSON 오류도 제한적으로 재시도한다", async () => {
    let calls = 0;
    const integrity = await resolveRootageIntegrity("2.5.0", sourceSha, {
      attempts: 3,
      delayMs: 0,
      fetchImpl: async () => {
        calls += 1;
        if (calls === 1) throw new Error("temporary network failure");
        if (calls === 2) return new Response("not-json", { status: 200 });
        return Response.json(registryVersion("2.5.0"));
      },
      sleep: async () => {},
    });

    expect(integrity).toBe("sha512-YWJjZA==");
    expect(calls).toBe(3);
  });

  test("gitHead가 아직 없는 metadata는 source 불일치로 확정하지 않고 재시도한다", async () => {
    let calls = 0;
    const integrity = await resolveRootageIntegrity("2.5.0", sourceSha, {
      allowSourceMismatch: true,
      attempts: 2,
      delayMs: 0,
      fetchImpl: async () => {
        calls += 1;
        return Response.json(
          calls === 1 ? registryVersion("2.5.0", { gitHead: undefined }) : registryVersion("2.5.0"),
        );
      },
      sleep: async () => {},
    });

    expect(integrity).toBe("sha512-YWJjZA==");
    expect(calls).toBe(2);
  });

  test("다른 gitHead와 Rootage 계약 밖 integrity를 즉시 거부한다", async () => {
    await expect(
      resolveRootageIntegrity("2.5.0", sourceSha, {
        attempts: 2,
        fetchImpl: async () => Response.json(registryVersion("2.5.0", { gitHead: "b".repeat(40) })),
      }),
    ).rejects.toThrow("gitHead");

    await expect(
      resolveRootageIntegrity("2.5.0", sourceSha, {
        attempts: 2,
        fetchImpl: async () =>
          Response.json(
            registryVersion("2.5.0", {
              dist: {
                integrity: "sha384-YWJjZA==",
                tarball: "https://registry.npmjs.org/rootage-artifacts-2.5.0.tgz",
              },
            }),
          ),
      }),
    ).rejects.toThrow("integrity 형식");
  });

  test("Changesets hint가 없으면 다른 gitHead를 이번 source 소유가 아닌 것으로 건너뛴다", async () => {
    const integrity = await resolveRootageIntegrity("2.5.0", sourceSha, {
      allowSourceMismatch: true,
      attempts: 1,
      fetchImpl: async () => Response.json(registryVersion("2.5.0", { gitHead: "b".repeat(40) })),
    });

    expect(integrity).toBeNull();
  });

  test("끝내 나타나지 않은 버전과 잘못된 source SHA를 거부한다", async () => {
    await expect(
      resolveRootageIntegrity("2.5.0", sourceSha, {
        attempts: 1,
        fetchImpl: async () => new Response("not found", { status: 404 }),
      }),
    ).rejects.toThrow("확인하지 못했습니다");

    await expect(resolveRootageIntegrity("2.5.0", "main")).rejects.toThrow("source SHA");
  });
});
