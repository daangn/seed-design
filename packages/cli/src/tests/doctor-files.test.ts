import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import fs from "fs-extra";

import { discoverSourceFiles } from "../utils/doctor-files";

let tempDir: string;

beforeAll(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "seed-doctor-files-"));

  await fs.outputFile(path.join(tempDir, "src/a.tsx"), "export const a = 1;\n");
  await fs.outputFile(path.join(tempDir, "src/nested/b.ts"), "export const b = 2;\n");
  await fs.outputFile(path.join(tempDir, "src/styles.css"), ".a {}\n");
  await fs.outputFile(path.join(tempDir, "node_modules/pkg/index.ts"), "export const x = 1;\n");
  await fs.outputFile(path.join(tempDir, "dist/out.ts"), "export const x = 1;\n");
  await fs.outputFile(path.join(tempDir, "tests/legacy.tsx"), "export const t = 1;\n");
});

afterAll(async () => {
  await fs.remove(tempDir);
});

describe("discoverSourceFiles", () => {
  test("소스 확장자만 찾고 기본 제외 디렉토리를 건너뛴다", async () => {
    const files = await discoverSourceFiles({ cwd: tempDir });

    expect(files.map((file) => file.path)).toEqual([
      "src/a.tsx",
      "src/nested/b.ts",
      "tests/legacy.tsx",
    ]);
    expect(files[0].content).toBe("export const a = 1;\n");
  });

  test("경로 인자로 스캔 범위를 좁힌다 (디렉토리·파일 혼용)", async () => {
    const files = await discoverSourceFiles({
      cwd: tempDir,
      paths: ["src/nested", "src/a.tsx"],
    });

    expect(files.map((file) => file.path)).toEqual(["src/a.tsx", "src/nested/b.ts"]);
  });

  test("설정 ignore glob을 적용한다", async () => {
    const files = await discoverSourceFiles({ cwd: tempDir, ignore: ["tests/**"] });

    expect(files.map((file) => file.path)).toEqual(["src/a.tsx", "src/nested/b.ts"]);
  });

  test("존재하지 않는 경로는 매치 없이 조용히 통과한다", async () => {
    const files = await discoverSourceFiles({ cwd: tempDir, paths: ["missing-dir"] });

    expect(files).toEqual([]);
  });
});
