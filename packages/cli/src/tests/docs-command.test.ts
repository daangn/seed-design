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

describe("docs command", () => {
  let server: Server;
  let baseUrl: string;
  let reactProjectDir: string;

  beforeAll(async () => {
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

    it("descends exactly one level", async () => {
      const result = await runDocs(["list", "react/"]);

      expectSuccess(result);
      expect(result.stdout.trimEnd()).toBe(
        [
          "/react/components/  4개 항목",
          "/react/stackflow/   1개 항목",
          "/react/updates/     1개 항목",
        ].join("\n"),
      );
    });

    it("marks a container with a trailing slash and a document without one", async () => {
      const result = await runDocs(["list", "react/components/"]);

      expectSuccess(result);
      expect(result.stdout.trimEnd()).toBe(
        [
          "/react/components/action-button  Action Button",
          "/react/components/bottom-sheet   Bottom Sheet",
          "/react/components/concepts/      1개 항목",
          "/react/components/iconography/   1개 항목",
        ].join("\n"),
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

    it("takes a shortened scope the way it takes a shortened address", async () => {
      const [shortened, anchored] = await Promise.all([
        runDocs(["list", "stackflow/"]),
        runDocs(["list", "/react/stackflow/"]),
      ]);

      expectSuccess(shortened);
      expect(shortened.stdout.trimEnd()).toBe("/react/stackflow/bottom-sheet  Bottom Sheet");
      expect(shortened.stdout).toBe(anchored.stdout);
    });

    it("marks a deprecated document", async () => {
      const result = await runDocs(["list", "lynx/components/"]);

      expectSuccess(result);
      expect(result.stdout).toContain("Checkbox (deprecated)");
    });

    it("exits 1 when the address reaches nothing", async () => {
      const result = await runDocs(["list", "nonexistent/"]);

      expect(result.exitCode).toBe(1);
      expect(result.stdout).toBe("");
    });
  });

  describe("search", () => {
    it("prints one address per line and nothing else", async () => {
      const result = await runDocs(["search", "action-button"]);

      expectSuccess(result);
      expect(result.stdout.trimEnd()).toBe(
        ["/lynx/components/action-button", "/react/components/action-button"].join("\n"),
      );
    });

    it("matches a word carried only by the title", async () => {
      const result = await runDocs(["search", "Iconography"]);

      expectSuccess(result);
      expect(result.stdout.trimEnd()).toBe("/react/components/iconography/composition");
    });

    it("keeps the count off stdout", async () => {
      const result = await runDocs(["search", "composition"]);

      expectSuccess(result);
      expect(result.stderr).toContain("2개 문서를 찾았어요.");
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

    it("resolves a tail query that reaches exactly one document", async () => {
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

    it("takes the exact address the ambiguous query listed", async () => {
      const result = await runDocs(["read", "/lynx/components/action-button"]);

      expectSuccess(result);
      expect(result.stdout.trimEnd()).toBe("# served /llms/lynx/components/action-button.txt");
    });

    it("does not read an exact address as a tail query", async () => {
      // `/components/bottom-sheet` is nobody's path, though two documents end with it.
      const result = await runDocs(["read", "/components/bottom-sheet"]);

      expect(result.exitCode).toBe(1);
      expect(result.stdout).toBe("");
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
