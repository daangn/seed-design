import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dir, "../../../..");

/**
 * Which stream each command writes to.
 *
 * A failure that lands on stdout is invisible to anything watching stderr for trouble, and it
 * pollutes the stream a caller pipes onward. Both halves are asserted together: the reason has
 * to reach stderr, and it has to be absent from stdout.
 */

/** A URL nothing listens on, so the command fails without reaching the network. */
const unreachableUrl = "http://127.0.0.1:1";

describe("output streams", () => {
  let projectDir: string;

  beforeAll(async () => {
    projectDir = await mkdtemp(path.join(tmpdir(), "seed-streams-"));
    await writeFile(
      path.join(projectDir, "package.json"),
      JSON.stringify({ name: "seed-streams-fixture", version: "0.0.0" }),
    );
    await writeFile(
      path.join(projectDir, "seed-design.json"),
      JSON.stringify({ framework: "react", tsx: true, rsc: false, path: "./seed-design" }),
    );
  });

  afterAll(async () => {
    await rm(projectDir, { force: true, recursive: true });
  });

  async function runCli(args: string[], cwd = projectDir) {
    const proc = Bun.spawn({
      cmd: [process.execPath, path.join(repoRoot, "packages/cli/src/index.ts"), ...args],
      cwd,
      env: { ...process.env, DISABLE_TELEMETRY: "true", FORCE_COLOR: "0", NO_COLOR: "1" },
      stderr: "pipe",
      stdout: "pipe",
      stdin: "ignore",
    });

    const [exitCode, stdout, stderr] = await Promise.all([
      proc.exited,
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text(),
    ]);
    return { exitCode, stderr, stdout };
  }

  describe("every command reports a failure on stderr", () => {
    it("compat", async () => {
      const result = await runCli(["compat", "--all", "-u", unreachableUrl]);

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain("호환성 검사에 실패했어요.");
      expect(result.stdout).not.toContain("호환성 검사에 실패했어요.");
    });

    it("add", async () => {
      const result = await runCli(["add", "ui:action-button", "-u", unreachableUrl]);

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain("추가에 실패했어요.");
      expect(result.stdout).not.toContain("추가에 실패했어요.");
    });

    it("add-all", async () => {
      const result = await runCli(["add-all", "-u", unreachableUrl]);

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain("추가에 실패했어요.");
      expect(result.stdout).not.toContain("추가에 실패했어요.");
    });

    it("init", async () => {
      // A directory where the config file belongs, so writing it fails for a reason that has
      // nothing to do with the network or with what was typed.
      const blockedDir = await mkdtemp(path.join(tmpdir(), "seed-streams-init-"));
      await mkdir(path.join(blockedDir, "seed-design.json"));

      const result = await runCli(["init", "-y"], blockedDir);

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain("seed-design.json 파일 생성에 실패했어요.");
      expect(result.stdout).not.toContain("seed-design.json 파일 생성에 실패했어요.");

      await rm(blockedDir, { force: true, recursive: true });
    });

    it("docs", async () => {
      const result = await runCli(["docs", "list", "-u", unreachableUrl]);

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain("문서 조회에 실패했어요.");
      expect(result.stdout).toBe("");
    });
  });
});
