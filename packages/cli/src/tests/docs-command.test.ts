import { buildDocsIndex } from "@seed-design/docs-search";
import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { createServer, type Server } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dir, "../../../..");

const docsIndex = {
  categories: [
    {
      id: "lynx",
      label: "Lynx",
      items: [
        {
          id: "action-button",
          title: "Action Button",
          docUrl: "/lynx/components/action-button",
        },
        {
          id: "checkbox",
          title: "Checkbox",
          docUrl: "/lynx/components/checkbox",
          deprecated: true,
        },
      ],
    },
    {
      id: "react",
      label: "React",
      items: [
        // The category's own landing page, which has no slug of its own: `/react` is that
        // document, and `react/` is what the category holds.
        {
          id: "overview",
          title: "Overview",
          docUrl: "/react",
          llmsUrl: "/llms/react.txt",
        },
        {
          id: "action-button",
          title: "Action Button",
          docUrl: "/react/components/action-button",
          llmsUrl: "/llms/react/components/action-button.txt",
        },
        {
          id: "bottom-sheet",
          title: "Bottom Sheet",
          docUrl: "/react/components/bottom-sheet",
          llmsUrl: "/llms/react/components/bottom-sheet.txt",
        },
        // Nested one level deeper than their shared parent, so a path rebuilt from ids
        // lands both of these on `react/components/composition`.
        {
          id: "composition",
          title: "Composition (Concepts)",
          docUrl: "/react/components/concepts/composition",
          llmsUrl: "/llms/react/components/concepts/composition.txt",
        },
        {
          id: "composition",
          title: "Composition (Iconography)",
          docUrl: "/react/components/iconography/composition",
          llmsUrl: "/llms/react/components/iconography/composition.txt",
        },
        // The same id under two containers of one category, as `bottom-sheet` is on the
        // real site.
        {
          id: "bottom-sheet",
          title: "Bottom Sheet",
          docUrl: "/react/stackflow/bottom-sheet",
          llmsUrl: "/llms/react/stackflow/bottom-sheet.txt",
        },
        {
          id: "changelog",
          title: "Changelog",
          docUrl: "/react/updates/changelog",
          llmsUrl: "/llms/react/updates/changelog.txt",
        },
      ],
    },
  ],
};

/**
 * A search index built through the same builder the site publishes with, from pages declared
 * here rather than downloaded, so the ranking a test asserts on depends on nothing outside
 * this file.
 *
 * Each page contributes a `page` row carrying its title and a `text` row carrying body prose
 * no title repeats, which is what separates full-text search from the name matching it
 * replaced. Anchors ride on the heading rows, as they do in the real index.
 */
const buildSearchIndex = () =>
  buildDocsIndex(
    [
      {
        url: "/react/components/action-button",
        title: "Action Button",
        heading: "로딩 상태",
        body: "비동기 작업이 끝날 때까지 스피너를 보여줍니다.",
      },
      {
        url: "/lynx/components/action-button",
        title: "Action Button",
        heading: "지원 범위",
        body: "Lynx 엔진에서 동작하는 버튼입니다.",
      },
      {
        url: "/react/components/bottom-sheet",
        title: "Bottom Sheet",
        heading: "스냅 포인트",
        body: "시트의 높이를 단계별로 확장하거나 축소합니다.",
      },
      {
        url: "/react/components/concepts/composition",
        title: "Composition",
        heading: "합성하기",
        body: "여러 컴포넌트를 겹쳐 하나의 인터랙션을 만듭니다.",
      },
    ].map(({ url, title, heading, body }) => ({
      id: url,
      url,
      title,
      structuredData: {
        headings: [{ id: heading, content: heading }],
        contents: [{ heading, content: body }],
      },
    })),
  );

/**
 * Only these resolve, so a request for anything else fails the way the real site would.
 * Every one of them is an `llmsUrl` the index carries — `read` reaches no other URL.
 */
const servedTxt = new Set([
  "/llms/react.txt",
  "/llms/react/components/action-button.txt",
  "/llms/react/components/concepts/composition.txt",
  "/llms/react/updates/changelog.txt",
  "/llms/lynx/components/action-button.txt",
  "/llms/lynx/components/checkbox.txt",
]);

/**
 * What only a spawned process can answer: the exit code, which stream each answer lands on, and
 * whether the command reaches the URL its address resolved to.
 *
 * Which documents an address names is not that. Those rules are pure functions over the index,
 * and `docs-address.test.ts` holds them — the cases here take one address per rule and follow it
 * the rest of the way out, rather than re-deriving the grammar a process at a time.
 */
describe("docs command", () => {
  let server: Server;
  let baseUrl: string;
  let reactProjectDir: string;
  let cacheDir: string;
  let searchIndex: Awaited<ReturnType<typeof buildSearchIndex>>;

  beforeAll(async () => {
    searchIndex = await buildSearchIndex();
    // The index cache is the CLI's first piece of durable state. Left at its default it would
    // write into the developer's own cache directory.
    cacheDir = await mkdtemp(path.join(tmpdir(), "seed-docs-cache-"));

    // A project that configures a framework, to prove the commands ignore it.
    reactProjectDir = await mkdtemp(path.join(tmpdir(), "seed-docs-react-"));
    await writeFile(
      path.join(reactProjectDir, "seed-design.json"),
      JSON.stringify({ framework: "react", tsx: true, rsc: false, path: "./seed-design" }),
    );
    await writeFile(
      path.join(reactProjectDir, "package.json"),
      JSON.stringify({ name: "seed-docs-fixture", version: "0.0.0" }),
    );

    server = createServer((request, response) => {
      const url = request.url ? new URL(request.url, "http://127.0.0.1") : undefined;
      const pathname = url?.pathname ?? "/";

      if (pathname === "/__docs__/index.json") {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(docsIndex));
        return;
      }

      if (pathname === "/api/search.json") {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(searchIndex));
        return;
      }

      if (servedTxt.has(pathname)) {
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.end(`# served ${pathname}`);
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
      throw new Error("Failed to start test docs server");
    }
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    await rm(reactProjectDir, { force: true, recursive: true });
    await rm(cacheDir, { force: true, recursive: true });
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  });

  async function runDocs(args: string[], cwd = repoRoot) {
    const proc = Bun.spawn({
      // An absolute entry path, because these run from a fixture project as well as from
      // the repo, and only the working directory is meant to differ between the two.
      cmd: [
        process.execPath,
        path.join(repoRoot, "packages/cli/src/index.ts"),
        "docs",
        ...args,
        "-u",
        baseUrl,
      ],
      cwd,
      env: {
        ...process.env,
        DISABLE_TELEMETRY: "true",
        FORCE_COLOR: "0",
        SEED_CACHE_DIR: cacheDir,
      },
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

  function expectSuccess(result: { exitCode: number; stdout: string; stderr: string }) {
    if (result.exitCode !== 0) {
      throw new Error(
        `docs command failed\nbaseUrl:${baseUrl}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
      );
    }
  }

  // The frame, symbols and spinner frames @clack/prompts draws, plus the escapes it
  // colours them with. None of it belongs in output a caller pipes somewhere.
  const DECORATION_GLYPH = /[│┌└●◇◆■▲◒◐◓◑]/;
  const ESC = String.fromCharCode(27);

  function expectPlain(text: string) {
    expect(text).not.toMatch(DECORATION_GLYPH);
    expect(text.includes(ESC)).toBe(false);
  }

  describe("without a subcommand", () => {
    it("exits 1 with an empty stdout", async () => {
      const result = await runDocs([]);

      expect(result.exitCode).toBe(1);
      expect(result.stdout).toBe("");
      expect(result.stderr).not.toBe("");
    });

    it("does not read a trailing value as an address", async () => {
      const result = await runDocs(["/react/components/action-button"]);

      expect(result.exitCode).toBe(1);
      expect(result.stdout).toBe("");
    });
  });

  describe("list", () => {
    it("names the categories, and the landing page beside its container", async () => {
      const result = await runDocs(["list"]);

      expectSuccess(result);
      expect(result.stdout.trimEnd()).toBe(
        ["/lynx/   2개 항목", "/react   Overview", "/react/  6개 항목"].join("\n"),
      );
    });

    it("answers the same way from a project that configures a framework", async () => {
      const [fromRepo, fromProject] = await Promise.all([
        runDocs(["list", "react/"]),
        runDocs(["list", "react/"], reactProjectDir),
      ]);

      expectSuccess(fromProject);
      expect(fromProject.stdout).toBe(fromRepo.stdout);
    });

    it("lists under every container a shortened scope reaches, merged and sorted as one", async () => {
      // `resolveScopes` answers with both containers, and the listings are flattened, deduped
      // by address and re-sorted here rather than printed one block per scope.
      const result = await runDocs(["list", "components/"]);

      expectSuccess(result);
      expect(result.stdout.trimEnd()).toBe(
        [
          "/lynx/components/action-button   Action Button",
          "/lynx/components/checkbox        Checkbox (deprecated)",
          "/react/components/action-button  Action Button",
          "/react/components/bottom-sheet   Bottom Sheet",
          "/react/components/concepts/      1개 항목",
          "/react/components/iconography/   1개 항목",
        ].join("\n"),
      );
    });

    it("exits 1 when the address reaches nothing", async () => {
      const result = await runDocs(["list", "nonexistent/"]);

      expect(result.exitCode).toBe(1);
      expect(result.stdout).toBe("");
    });
  });

  describe("search", () => {
    it("finds a document by prose no title carries, under the anchor that carries it", async () => {
      const result = await runDocs(["search", "스피너"]);

      expectSuccess(result);
      expect(result.stdout.trimEnd()).toBe("/react/components/action-button#로딩 상태");
    });

    it("prints the anchor the match sits under", async () => {
      const result = await runDocs(["search", "스냅 포인트"]);

      expectSuccess(result);
      expect(result.stdout.trimEnd()).toBe("/react/components/bottom-sheet#스냅 포인트");
    });

    it("ranks the document carrying every word above the ones carrying only some", async () => {
      const result = await runDocs(["search", "Lynx 버튼"]);

      expectSuccess(result);
      expect(result.stdout.trimEnd().split("\n")[0]).toBe(
        "/lynx/components/action-button#지원 범위",
      );
    });

    it("keeps the count off stdout", async () => {
      const result = await runDocs(["search", "스피너"]);

      expectSuccess(result);
      expect(result.stderr).toContain("1개 문서를 찾았어요.");
      expect(result.stdout).not.toContain("찾았어요");
    });

    it("exits 1 with an empty stdout when nothing matches", async () => {
      const result = await runDocs(["search", "nonexistent-thing"]);

      expect(result.exitCode).toBe(1);
      expect(result.stdout).toBe("");
    });

    it("exits 1 when given no name", async () => {
      const result = await runDocs(["search"]);

      expect(result.exitCode).toBe(1);
      expect(result.stdout).toBe("");
    });

    it("exits 1 on a blank name rather than matching everything", async () => {
      for (const blank of ["", "   "]) {
        const result = await runDocs(["search", blank]);

        expect(result.exitCode).toBe(1);
        expect(result.stdout).toBe("");
      }
    });
  });

  describe("read", () => {
    it("prints the document body for an exact address", async () => {
      const result = await runDocs(["read", "/react/components/action-button"]);

      expectSuccess(result);
      expect(result.stdout.trimEnd()).toBe("# served /llms/react/components/action-button.txt");
    });

    it("puts nothing of its own on stdout, down to the last byte", async () => {
      const result = await runDocs(["read", "/react/components/action-button"]);

      expectSuccess(result);
      expectPlain(result.stdout);
      // The fixture server ends the body without a newline, so a trailing one here could
      // only have come from the CLI.
      expect(result.stdout).toBe("# served /llms/react/components/action-button.txt");
    });

    it("reads a category landing page by its own address", async () => {
      const result = await runDocs(["read", "/react"]);

      expectSuccess(result);
      expect(result.stdout.trimEnd()).toBe("# served /llms/react.txt");
    });

    it("follows a tail query through to the document it reaches", async () => {
      // The only success path that runs on the tail resolver's output rather than an exact
      // address: what it settles on has to reach the fetch the same way.
      const result = await runDocs(["read", "concepts/composition"]);

      expectSuccess(result);
      expect(result.stdout.trimEnd()).toBe(
        "# served /llms/react/components/concepts/composition.txt",
      );
    });

    it("fails on a tail query that reaches several, naming each", async () => {
      const result = await runDocs(["read", "action-button"]);

      expect(result.exitCode).toBe(1);
      expect(result.stdout).toBe("");
      expect(result.stderr).toContain("/lynx/components/action-button");
      expect(result.stderr).toContain("/react/components/action-button");
    });

    it("reports a miss for an address the index does not carry", async () => {
      const result = await runDocs(["read", "/react/nope"]);

      expect(result.exitCode).toBe(1);
      expect(result.stdout).toBe("");
      expect(result.stderr).toContain("seed-design docs search");
    });

    it("exits 1 when given no address", async () => {
      const result = await runDocs(["read"]);

      expect(result.exitCode).toBe(1);
      expect(result.stdout).toBe("");
    });

    it("refuses a container address instead of reading what sits under it", async () => {
      // `/react/updates` holds exactly one document, so picking it would look like success
      // until the site grew a second one.
      const result = await runDocs(["read", "react/updates/"]);

      expect(result.exitCode).toBe(1);
      expect(result.stdout).toBe("");
      expect(result.stderr).toContain("seed-design docs list");
    });

    it("refuses the root address", async () => {
      const result = await runDocs(["read", "/"]);

      expect(result.exitCode).toBe(1);
      expect(result.stdout).toBe("");
      // Not the whole index listed back as candidates.
      expect(result.stderr.split("\n").length).toBeLessThan(10);
    });

    it("prints a stack trace with --verbose, from either side of the command name", async () => {
      const [plain, after, before] = await Promise.all([
        runDocs(["read", "/react/nope"]),
        runDocs(["read", "/react/nope", "--verbose"]),
        runDocs(["--verbose", "read", "/react/nope"]),
      ]);

      expect(plain.stderr).not.toContain("docs.ts:");
      expect(after.stderr).toContain("docs.ts:");
      expect(before.stderr).toContain("docs.ts:");
    });
  });
});
