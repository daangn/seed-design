import { describe, expect, it } from "bun:test";
import path from "node:path";
import { deserializeGitTimestampsManifest, serializeGitTimestampsManifest } from "./git-timestamps";

describe("Git 타임스탬프 매니페스트", () => {
  it("상대 경로로 직렬화하고 다른 절대 경로에서도 복원합니다", () => {
    const sourceDirectory = path.resolve("/source/content");
    const targetDirectory = path.resolve("/target/content");
    const modifiedAt = new Date("2026-08-11T03:00:00.000Z");
    const serialized = serializeGitTimestampsManifest(
      new Map([[path.join(sourceDirectory, "react/components/button.mdx"), modifiedAt]]),
      sourceDirectory,
    );

    expect(deserializeGitTimestampsManifest(serialized, targetDirectory)).toEqual(
      new Map([[path.join(targetDirectory, "react/components/button.mdx"), modifiedAt]]),
    );
  });

  it("지원하지 않는 버전은 거부합니다", () => {
    expect(() =>
      deserializeGitTimestampsManifest('{"version":2,"timestamps":{}}', "/content"),
    ).toThrow("지원하지 않는 Git 타임스탬프 매니페스트입니다");
  });
});
