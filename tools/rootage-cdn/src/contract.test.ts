import { describe, expect, test } from "bun:test";
import { compareStableVersions, parseManifest, parsePointer, sha256 } from "./contract";

const checksum = "a".repeat(64);
const integrity = `sha512-${"A".repeat(86)}==`;

describe("Rootage 저장 계약", () => {
  test("완료 manifest를 엄격하게 검증한다", () => {
    const manifest = parseManifest({
      schemaVersion: 1,
      package: "@seed-design/rootage-artifacts",
      version: "1.2.3",
      npmIntegrity: integrity,
      gitHead: "b".repeat(40),
      files: [
        { path: "/index.json", key: "versions/v1.2.3/index.json", bytes: 2, sha256: checksum },
      ],
    });
    expect(manifest.version).toBe("1.2.3");
    expect(() => parseManifest({ ...manifest, unknown: true })).toThrow("필드가 올바르지 않습니다");
  });

  test("stable 포인터와 버전 순서를 검증한다", () => {
    expect(
      parsePointer({
        schemaVersion: 1,
        version: "2.0.0",
        manifestSha256: checksum,
        npmIntegrity: integrity,
      }).version,
    ).toBe("2.0.0");
    expect(compareStableVersions("2.0.0", "1.99.99")).toBe(1);
    expect(() =>
      parsePointer({
        schemaVersion: 1,
        version: "2.0.0-beta.1",
        manifestSha256: checksum,
        npmIntegrity: integrity,
      }),
    ).toThrow();
  });

  test("SHA-256을 계산한다", async () => {
    expect(await sha256(new TextEncoder().encode("rootage"))).toBe(
      "d3038dfa0f51bf33d8c13072f41d8c1971c3d5f9e9b65a2ef704c2b6f5e6e2a4",
    );
  });
});
