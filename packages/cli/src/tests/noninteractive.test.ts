import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createServer, type Server } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dir, "../../../..");

/**
 * What the commands do when there is no terminal to answer a prompt with.
 *
 * `stdin: "ignore"` and a piped stdout are what an agent or a CI runner hands the process, and
 * they are what the guards read. Every case asserts the exit code together with what is on
 * disk, because the ending being replaced here was an exit `0` over an untouched working tree:
 * a code alone would have passed against the bug just as well as against the fix.
 */
const items = [
  { id: "action-button", snippets: [{ path: "action-button.tsx" }] },
  { id: "old-button", deprecated: true, snippets: [{ path: "old-button.tsx" }] },
];

/** No `dependencies` anywhere, so nothing reaches a package manager. */
const snippetContent = "export const Snippet = () => <button>ok</button>;\n";

const handEdited = "// 손으로 고친 내용\n";

describe("non-interactive endings", () => {
  let server: Server;
  let baseUrl: string;
  const projectDirs: string[] = [];

  beforeAll(async () => {
    server = createServer((request, response) => {
      const pathname = request.url ? new URL(request.url, "http://127.0.0.1").pathname : "/";
      const item = items.find((i) => pathname === `/__registry__/react/ui/${i.id}.json`);

      const body = (() => {
        if (pathname === "/__registry__/react/index.json") return [{ id: "ui" }];
        if (pathname === "/__registry__/react/ui/index.json") return { id: "ui", items };
        if (item) {
          return { ...item, snippets: [{ path: item.snippets[0]?.path, content: snippetContent }] };
        }
        return null;
      })();

      if (!body) {
        response.writeHead(404, { "Content-Type": "text/plain" });
        response.end("Not found");
        return;
      }

      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify(body));
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
    await Promise.all(projectDirs.map((dir) => rm(dir, { force: true, recursive: true })));
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  async function createProject({ withConfig = true } = {}) {
    const dir = await mkdtemp(path.join(tmpdir(), "seed-noninteractive-"));
    projectDirs.push(dir);

    await writeFile(
      path.join(dir, "package.json"),
      JSON.stringify({ name: "seed-noninteractive-fixture", version: "0.0.0" }),
    );

    if (withConfig) {
      await writeFile(
        path.join(dir, "seed-design.json"),
        JSON.stringify({ framework: "react", tsx: true, rsc: false, path: "./seed-design" }),
      );
    }

    return dir;
  }

  async function runCli(args: string[], cwd: string) {
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

  const snippetPath = (dir: string, id: string) => path.join(dir, "seed-design", "ui", `${id}.tsx`);

  describe("init refuses without -y, and writes the defaults with it", () => {
    it("names -y and leaves no config file behind", async () => {
      const dir = await createProject({ withConfig: false });

      const result = await runCli(["init"], dir);

      expect(result.exitCode).toBe(2);
      expect(result.stderr).toContain("질문을 띄울 수 없어요");
      expect(result.stderr).toContain("seed-design init -y");
      expect(existsSync(path.join(dir, "seed-design.json"))).toBe(false);
    });

    it("writes the documented defaults when -y answers for the caller", async () => {
      const dir = await createProject({ withConfig: false });

      const result = await runCli(["init", "-y"], dir);

      expect(result.exitCode).toBe(0);
      expect(JSON.parse(await readFile(path.join(dir, "seed-design.json"), "utf8"))).toMatchObject({
        framework: "react",
        path: "./seed-design",
        rsc: false,
        tsx: true,
      });
    });
  });

  /**
   * The prompts with no answer of their own. Each names the argument that would have
   * answered it, because a caller that cannot see the question has no other way to find out.
   */
  describe("the prompts with no safe default refuse and name the argument", () => {
    it("add, with no item to add", async () => {
      const dir = await createProject();

      const result = await runCli(["add", "-u", baseUrl], dir);

      expect(result.exitCode).toBe(2);
      expect(result.stderr).toContain("추가할 항목을 지정해주세요.");
      expect(result.stderr).toContain("seed-design add ui:action-button");
    });

    it("add, with no config file, sends the caller to init", async () => {
      const dir = await createProject({ withConfig: false });

      const result = await runCli(["add", "ui:action-button", "-u", baseUrl], dir);

      expect(result.exitCode).toBe(2);
      expect(result.stderr).toContain("seed-design init -y");
      // The file it declined to write is the whole point: creating it here would settle the
      // path, the framework and the telemetry setting without any of them being seen.
      expect(existsSync(path.join(dir, "seed-design.json"))).toBe(false);
    });

    it("add, on an item the caller named that is deprecated", async () => {
      const dir = await createProject();

      const result = await runCli(["add", "ui:old-button", "-u", baseUrl], dir);

      expect(result.exitCode).toBe(2);
      expect(result.stderr).toContain("--include-deprecated");
      expect(existsSync(snippetPath(dir, "old-button"))).toBe(false);
    });

    it("add-all, with neither a registry nor --all, lists what there is", async () => {
      const dir = await createProject();

      const result = await runCli(["add-all", "-u", baseUrl], dir);

      expect(result.exitCode).toBe(2);
      expect(result.stderr).toContain("사용 가능한 레지스트리: ui");
      expect(result.stderr).toContain("--all");
    });

    it("add, on a file whose contents differ, leaves it and reports the path", async () => {
      const dir = await createProject();
      await runCli(["add", "ui:action-button", "-u", baseUrl], dir);
      await writeFile(snippetPath(dir, "action-button"), handEdited);

      const result = await runCli(["add", "ui:action-button", "-u", baseUrl], dir);

      expect(result.exitCode).toBe(2);
      expect(result.stderr).toContain(path.join("seed-design", "ui", "action-button.tsx"));
      expect(await readFile(snippetPath(dir, "action-button"), "utf8")).toBe(handEdited);
    });
  });

  describe("an argument answers the prompt ahead of time", () => {
    it("--include-deprecated adds the item the refusal named", async () => {
      const dir = await createProject();

      const result = await runCli(
        ["add", "ui:old-button", "--include-deprecated", "-u", baseUrl],
        dir,
      );

      expect(result.exitCode).toBe(0);
      expect(existsSync(snippetPath(dir, "old-button"))).toBe(true);
    });

    it("--on-diff skip keeps the file that is already there", async () => {
      const dir = await createProject();
      await runCli(["add", "ui:action-button", "-u", baseUrl], dir);
      await writeFile(snippetPath(dir, "action-button"), handEdited);

      const result = await runCli(
        ["add", "ui:action-button", "--on-diff", "skip", "-u", baseUrl],
        dir,
      );

      expect(result.exitCode).toBe(0);
      expect(await readFile(snippetPath(dir, "action-button"), "utf8")).toBe(handEdited);
    });

    it("--on-diff overwrite replaces it", async () => {
      const dir = await createProject();
      await runCli(["add", "ui:action-button", "-u", baseUrl], dir);
      await writeFile(snippetPath(dir, "action-button"), handEdited);

      const result = await runCli(
        ["add", "ui:action-button", "--on-diff", "overwrite", "-u", baseUrl],
        dir,
      );

      expect(result.exitCode).toBe(0);
      expect(await readFile(snippetPath(dir, "action-button"), "utf8")).not.toBe(handEdited);
    });
  });
});
