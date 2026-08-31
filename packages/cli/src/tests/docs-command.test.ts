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
      sections: [
        {
          id: "components",
          label: "Components",
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
            },
          ],
        },
      ],
    },
    // Carries llmsIndexUrl. A container is answered with what it holds regardless, so
    // this is here to prove the command does not reach for it.
    {
      id: "react",
      label: "React",
      llmsIndexUrl: "/react/llms.txt",
      sections: [
        // Carries the category's own landing page, which has no slug of its own: `/react`
        // is both this document and the category listing.
        {
          id: "getting-started",
          label: "Getting Started",
          items: [
            {
              id: "overview",
              title: "Overview",
              docUrl: "/react",
              llmsUrl: "/llms/react/index.txt",
            },
          ],
        },
        {
          id: "components",
          label: "Components",
          items: [
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
            // Nested one level deeper than the slug the section groups by, so a path
            // rebuilt from ids lands both of these on `react/components/composition`.
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
          ],
        },
        // The same id filed under two sections of one category, as `bottom-sheet` is on
        // the real site.
        {
          id: "stackflow",
          label: "Stackflow",
          items: [
            {
              id: "bottom-sheet",
              title: "Bottom Sheet",
              docUrl: "/react/stackflow/bottom-sheet",
              llmsUrl: "/llms/react/stackflow/bottom-sheet.txt",
            },
          ],
        },
        {
          id: "updates",
          label: "Updates",
          items: [
            {
              id: "changelog",
              title: "Changelog",
              docUrl: "/react/updates/changelog",
              llmsUrl: "/llms/react/updates/changelog.txt",
            },
          ],
        },
      ],
    },
  ],
};

/**
 * Only these resolve. Serving every `.txt` would let the composed-URL fallback answer for
 * paths the real site 404s, and the tests asserting a miss would pass on a hit.
 */
const servedTxt = new Set([
  "/react/llms.txt",
  "/llms/react/index.txt",
  "/llms/react/components/action-button.txt",
  "/llms/react/components/concepts/composition.txt",
  "/llms/react/updates/changelog.txt",
  "/llms/react/updates/changelog/react/1.2.5.txt",
  "/llms/lynx/components/action-button.txt",
  "/llms/lynx/components/checkbox.txt",
]);

describe("docs command", () => {
  let server: Server;
  let baseUrl: string;
  let reactProjectDir: string;
  const requests: string[] = [];

  beforeAll(async () => {
    // A project that configures a framework, to prove the command ignores it.
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
      requests.push(pathname);

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

  async function runDocsCommand(args: string[], env: Record<string, string> = {}) {
    const proc = Bun.spawn({
      cmd: [process.execPath, "packages/cli/src/index.ts", "docs", ...args, "-u", baseUrl],
      cwd: repoRoot,
      env: {
        ...process.env,
        DISABLE_TELEMETRY: "true",
        FORCE_COLOR: "0",
        ...env,
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
        `docs command failed\nbaseUrl:${baseUrl}\nrequests:${requests.join(",")}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
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

  // The shell splits on spaces before this command sees anything, so a path typed without
  // slashes has to mean what the same path with slashes means.
  it("reads a path split across arguments as one path", async () => {
    requests.length = 0;
    const spaced = await runDocsCommand(["lynx", "components", "action-button"]);
    const quoted = await runDocsCommand(["lynx components action-button"]);
    const slashed = await runDocsCommand(["lynx/components/action-button"]);

    expectSuccess(spaced);
    expect(spaced.stdout.trim()).toBe("# served /llms/lynx/components/action-button.txt");
    expect(quoted.stdout).toBe(spaced.stdout);
    expect(slashed.stdout).toBe(spaced.stdout);
  });

  describe("without a TTY to prompt on", () => {
    it("lists the categories when given no query", async () => {
      const result = await runDocsCommand([]);

      expectSuccess(result);
      expect(result.stdout).toContain("lynx");
      expect(result.stdout).toContain("react");
    });

    it("lists the sections of a category that has several", async () => {
      const result = await runDocsCommand(["react"]);

      expectSuccess(result);
      expect(result.stdout).toContain("react/components");
      expect(result.stdout).toContain("react/updates");
      // The server serves this category's own `/react/llms.txt`, so reaching for it in
      // place of the listing would show up here.
      expect(result.stdout).not.toContain("# served");
    });

    it("lists the items of a named section", async () => {
      const result = await runDocsCommand(["react/components"]);

      expectSuccess(result);
      expect(result.stdout).toContain("react/components/action-button");
    });

    it("exits 1 when a query matches nothing", async () => {
      const result = await runDocsCommand(["react/components/nope"]);

      expect(result.exitCode).toBe(1);
      expect(result.stdout).toBe("");
    });
  });

  // A name is not an address, and this command answers only to addresses. Refusing it is
  // the point; naming the addresses that carry it is what keeps the refusal useful.
  describe("a bare name", () => {
    it("fails and names every address carrying it", async () => {
      const result = await runDocsCommand(["action-button"]);

      expect(result.exitCode).toBe(1);
      expect(result.stdout).toBe("");
      expect(result.stderr).toContain("lynx/components/action-button");
      expect(result.stderr).toContain("react/components/action-button");
      expect(result.stderr).toContain("seed-design docs-search action-button");
    });

    // A configured framework used to be spliced onto the front of a bare name, so the same
    // command answered differently depending on which directory it ran from.
    it("answers the same way from a project that configures a framework", async () => {
      const bare = await runDocsCommand(["action-button"]);
      const configured = await runDocsCommand(["action-button", "--cwd", reactProjectDir]);

      expect(configured.exitCode).toBe(bare.exitCode);
      expect(configured.stdout).toBe(bare.stdout);
      expect(configured.stderr).toBe(bare.stderr);
    });

    it("suggests a nearby address when the name matches nothing either", async () => {
      const result = await runDocsCommand(["react/componets"]);

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain("react/components");
    });
  });

  // Every path this command prints has to name the same document when it comes back in.
  // Rebuilding one as `category/section/item` broke that for pages nested deeper than the
  // slug their section groups by.
  describe("addressing a document by its published path", () => {
    it("resolves a page nested deeper than its section", async () => {
      const result = await runDocsCommand(["react/components/concepts/composition"]);

      expectSuccess(result);
      expect(result.stdout.trim()).toBe("# served /llms/react/components/concepts/composition.txt");
    });

    it("lists a nested page under the path that reaches it", async () => {
      const result = await runDocsCommand(["react/components"]);

      expectSuccess(result);
      expect(result.stdout).toContain("react/components/concepts/composition");
      expect(result.stdout).toContain("react/components/iconography/composition");
    });

    it("fails on a shortened path and names both pages it could have meant", async () => {
      const result = await runDocsCommand(["react/components/composition"]);

      expect(result.exitCode).toBe(1);
      expect(result.stdout).toBe("");
      expect(result.stderr).toContain("react/components/concepts/composition");
      expect(result.stderr).toContain("react/components/iconography/composition");
    });

    it("addresses a category landing page by id, and still lists the category", async () => {
      const landing = await runDocsCommand(["react/overview"]);
      const listing = await runDocsCommand(["react"]);

      expectSuccess(landing);
      expect(landing.stdout.trim()).toBe("# served /llms/react/index.txt");
      expectSuccess(listing);
      expect(listing.stdout).toContain("react/components");
    });

    it("fails on a name filed under two sections and names both", async () => {
      const result = await runDocsCommand(["react/bottom-sheet"]);

      expect(result.exitCode).toBe(1);
      expect(result.stdout).toBe("");
      expect(result.stderr).toContain("react/components/bottom-sheet");
      expect(result.stderr).toContain("react/stackflow/bottom-sheet");
    });
  });

  describe("plain output", () => {
    it("decorates neither a listing nor a resolved item", async () => {
      const listing = await runDocsCommand(["react"]);
      const item = await runDocsCommand(["react/components/action-button"]);

      expectSuccess(listing);
      expectSuccess(item);
      expectPlain(listing.stdout);
      expectPlain(item.stdout);
    });

    // The notice is written once per session from deep inside the telemetry client, and
    // it used to land on stdout, after the document body.
    it("keeps the telemetry notice off stdout", async () => {
      const result = await runDocsCommand(["react/components/action-button"], {
        // Telemetry on, but with nowhere to send to, so nothing leaves the process.
        DISABLE_TELEMETRY: "",
        SEED_DISABLE_TELEMETRY: "",
        POSTHOG_HOST: "",
        POSTHOG_API_KEY: "",
        NODE_ENV: "prod",
      });

      expectSuccess(result);
      // Without this the assertion below passes on a run where the notice never fired.
      expect(result.stderr).toContain("사용 데이터 수집 중");
      expect(result.stdout.trim()).toBe("# served /llms/react/components/action-button.txt");
    });
  });

  // There is one mode. A document is answered with its own text, a container with the
  // addresses it holds, and no flag chooses between the two.
  describe("document text and container listings", () => {
    it("prints the document body for a resolved item", async () => {
      const result = await runDocsCommand(["react/components/action-button"]);

      expectSuccess(result);
      expect(result.stdout.trim()).toBe("# served /llms/react/components/action-button.txt");
    });

    it("lists the documents of a category that holds a single section", async () => {
      const result = await runDocsCommand(["lynx"]);

      expectSuccess(result);
      expect(result.stdout.trim().split("\n")).toEqual([
        "lynx/components/action-button",
        "lynx/components/checkbox",
      ]);
    });

    it("composes a URL for a changelog path the index cannot carry", async () => {
      const result = await runDocsCommand(["react/updates/changelog/react/1.2.5"]);

      expectSuccess(result);
      expect(result.stdout.trim()).toBe("# served /llms/react/updates/changelog/react/1.2.5.txt");
    });

    // A composed URL is a guess, and the site answering 404 means the guess was wrong.
    // Reporting it as a miss keeps the index's diagnostics on a path the index never saw.
    it("reports a miss when every composed URL 404s", async () => {
      const result = await runDocsCommand(["react/updates/changelog/react/9.9.9"]);

      expect(result.exitCode).toBe(1);
      expect(result.stdout).toBe("");
      expect(result.stderr).toContain("그런 경로가 없어요");
      expect(result.stderr).toContain("seed-design docs-search");
      expect(result.stderr).not.toContain("다음 경로를 시도했어요");
    });
  });
});
