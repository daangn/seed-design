import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { createServer, type Server } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dir, "../../../..");

/**
 * Which stream each command writes to.
 *
 * A failure that lands on stdout is invisible to anything watching stderr for trouble, and it
 * pollutes the stream a caller pipes onward. Both halves are asserted together: the reason has
 * to reach stderr, and it has to be absent from stdout.
 *
 * The split between the two families is asserted too, because it is a decision rather than an
 * accident. `compat` answers a question, so it prints its findings bare the way `docs` does;
 * `add` and `init` walk someone through a change, so they keep the clack frame. Only the
 * failure path is common to both.
 */
const registry = {
  id: "ui",
  items: [
    {
      id: "action-button",
      snippets: [{ path: "action-button.tsx", dependencies: { "@seed-design/react": ">=1.2.0" } }],
    },
    // No seed dependency to check, so `compat` has nothing to report about it.
    { id: "plain-text", snippets: [{ path: "plain-text.tsx" }] },
  ],
};

/** A URL nothing listens on, so the command fails without reaching the fixture server. */
const unreachableUrl = "http://127.0.0.1:1";

describe("output streams", () => {
  let server: Server;
  let baseUrl: string;
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

    server = createServer((request, response) => {
      const pathname = request.url ? new URL(request.url, "http://127.0.0.1").pathname : "/";

      if (pathname === "/__registry__/react/index.json") {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify([{ id: registry.id }]));
        return;
      }

      if (pathname === `/__registry__/react/${registry.id}/index.json`) {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(registry));
        return;
      }

      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end("Not found");
    });

    await new Promise<void>((resolve) => {
      server.listen(0, "127.0.0.1", resolve);
    });

    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("Failed to start test registry server");
    }
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    await rm(projectDir, { force: true, recursive: true });
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  async function runCli(args: string[], cwd = projectDir) {
    const proc = Bun.spawn({
      cmd: [process.execPath, path.join(repoRoot, "packages/cli/src/index.ts"), ...args],
      cwd,
      // Colour off, so the assertions read the text rather than the escapes around it. A piped
      // stdout settles it on its own, but `optique` renders its help and usage without
      // consulting either variable, so both are spelled out for whatever reads them.
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

  /**
   * The three endings a caller has to tell apart, on the one command where all three exist.
   *
   * A CI gate reading only "non-zero" treats an unreachable registry as a project that failed
   * its check, which is the reading the codes are there to prevent.
   */
  describe("compat separates a verdict from a failure to reach one", () => {
    it("exits 0 when the snippets fit", async () => {
      const result = await runCli(["compat", "ui:plain-text", "-u", baseUrl]);

      expect(result.exitCode).toBe(0);
    });

    it("exits 1 when it checked and found incompatibilities", async () => {
      const result = await runCli(["compat", "ui:action-button", "-u", baseUrl]);

      expect(result.exitCode).toBe(1);
    });

    it("exits 2 when it could not reach the registry", async () => {
      const result = await runCli(["compat", "ui:action-button", "-u", unreachableUrl]);

      expect(result.exitCode).toBe(2);
    });

    it("exits 2 when the item named does not exist", async () => {
      const result = await runCli(["compat", "ui:does-not-exist-xyz", "-u", baseUrl]);

      expect(result.exitCode).toBe(2);
    });

    it("exits 0 when the project has nothing installed to check", async () => {
      const result = await runCli(["compat", "-u", baseUrl]);

      expect(result.exitCode).toBe(0);
    });

    it("exits 2 when it cannot tell which snippets to check", async () => {
      // A project with no `seed-design.json` is not a project with nothing installed: the
      // first cannot be answered, the second answers that nothing is wrong.
      const configlessDir = await mkdtemp(path.join(tmpdir(), "seed-streams-noconfig-"));
      await writeFile(
        path.join(configlessDir, "package.json"),
        JSON.stringify({ name: "seed-streams-noconfig", version: "0.0.0" }),
      );

      const result = await runCli(["compat", "-u", baseUrl], configlessDir);

      expect(result.exitCode).toBe(2);

      await rm(configlessDir, { force: true, recursive: true });
    });
  });

  describe("every command reports a failure on stderr", () => {
    it("compat", async () => {
      const result = await runCli(["compat", "--all", "-u", unreachableUrl]);

      expect(result.exitCode).toBe(2);
      expect(result.stderr).toContain("호환성 검사에 실패했어요.");
      expect(result.stdout).not.toContain("호환성 검사에 실패했어요.");
    });

    it("add", async () => {
      const result = await runCli(["add", "ui:action-button", "-u", unreachableUrl]);

      expect(result.exitCode).toBe(2);
      expect(result.stderr).toContain("추가에 실패했어요.");
      expect(result.stdout).not.toContain("추가에 실패했어요.");
    });

    it("add-all", async () => {
      const result = await runCli(["add-all", "-u", unreachableUrl]);

      expect(result.exitCode).toBe(2);
      expect(result.stderr).toContain("추가에 실패했어요.");
      expect(result.stdout).not.toContain("추가에 실패했어요.");
    });

    it("init", async () => {
      // A directory where the config file belongs, so writing it fails for a reason that has
      // nothing to do with the network or with what was typed.
      const blockedDir = await mkdtemp(path.join(tmpdir(), "seed-streams-init-"));
      await mkdir(path.join(blockedDir, "seed-design.json"));

      const result = await runCli(["init", "-y"], blockedDir);

      expect(result.exitCode).toBe(2);
      expect(result.stderr).toContain("seed-design.json 파일 생성에 실패했어요.");
      expect(result.stdout).not.toContain("seed-design.json 파일 생성에 실패했어요.");

      await rm(blockedDir, { force: true, recursive: true });
    });

    it("docs", async () => {
      const result = await runCli(["docs", "list", "-u", unreachableUrl]);

      expect(result.exitCode).toBe(2);
      expect(result.stderr).toContain("문서 조회에 실패했어요.");
      expect(result.stdout).toBe("");
    });
  });

  describe("compat prints its findings and nothing else on stdout", () => {
    it("puts the incompatibilities on stdout and the surrounding account on stderr", async () => {
      const result = await runCli(["compat", "ui:action-button", "-u", baseUrl]);

      expect(result.exitCode).toBe(1);
      expect(result.stdout).toBe(
        [
          "현재 프로젝트 버전과 호환되지 않는 스니펫을 찾았어요.",
          "현재 프로젝트 버전: @seed-design/react@미설치, @seed-design/css@미설치",
          "ui:action-button",
          "  - @seed-design/react: 패키지가 설치되어 있지 않아요. 필요 범위: >=1.2.0",
          "",
        ].join("\n"),
      );
      expect(result.stderr).toContain("검사 대상: ui:action-button");
      expect(result.stderr).toContain("호환성 이슈가 있어요.");
    });

    it("leaves stdout empty when there is nothing to report", async () => {
      const result = await runCli(["compat", "ui:plain-text", "-u", baseUrl]);

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toBe("");
      expect(result.stderr).toContain("모든 스니펫이 현재");
    });

    it("draws no clack frame", async () => {
      const result = await runCli(["compat", "ui:action-button", "-u", baseUrl]);

      expect(`${result.stdout}${result.stderr}`).not.toContain("│");
    });
  });

  describe("the interactive commands keep their frame on stdout", () => {
    it("add narrates progress inside the frame", async () => {
      const result = await runCli(["add", "ui:action-button", "-u", unreachableUrl]);

      expect(result.stdout).toContain("seed-design add");
      expect(result.stdout).toContain("│");
    });
  });
});
