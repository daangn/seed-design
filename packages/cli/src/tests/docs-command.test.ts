import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { createServer, type Server } from "node:http";
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
    // Carries llmsIndexUrl, which the archived sites' frozen indexes do not. The pair
    // covers both halves of the raw-mode category branch.
    {
      id: "react",
      label: "React",
      llmsIndexUrl: "/react/llms.txt",
      sections: [
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
  "/llms/react/components/action-button.txt",
  "/llms/react/updates/changelog.txt",
  "/llms/react/updates/changelog/react/1.2.5.txt",
  "/llms/lynx/components/action-button.txt",
  "/llms/lynx/components/checkbox.txt",
]);

describe("docs command", () => {
  let server: Server;
  let baseUrl: string;
  const requests: string[] = [];

  beforeAll(async () => {
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

  it("resolves unquoted Lynx component queries to docs and llms links", async () => {
    requests.length = 0;
    const result = await runDocsCommand(["lynx", "action-button"]);

    expectSuccess(result);
    expect(result.stdout).toContain("- docs: http://");
    expect(result.stdout).toContain("/lynx/components/action-button");
    expect(result.stdout).toContain("- llms.txt: http://");
    expect(result.stdout).toContain("/llms/lynx/components/action-button.txt");
  });

  it("resolves a quoted two-word query to the Lynx component", async () => {
    requests.length = 0;
    const result = await runDocsCommand(["lynx checkbox"]);

    expectSuccess(result);
    expect(result.stdout).toContain("- docs: http://");
    expect(result.stdout).toContain("/lynx/components/checkbox");
    expect(result.stdout).toContain("- llms.txt: http://");
    expect(result.stdout).toContain("/llms/lynx/components/checkbox.txt");
  });

  it("resolves registry-key queries with an explicit framework", async () => {
    requests.length = 0;
    const result = await runDocsCommand(["ui:checkbox", "--framework", "lynx"]);

    expectSuccess(result);
    expect(result.stdout).toContain("- docs: http://");
    expect(result.stdout).toContain("/lynx/components/checkbox");
    expect(result.stdout).toContain("- llms.txt: http://");
    expect(result.stdout).toContain("/llms/lynx/components/checkbox.txt");
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
    });

    it("lists the items of a named section", async () => {
      const result = await runDocsCommand(["react/components"]);

      expectSuccess(result);
      expect(result.stdout).toContain("react/components/action-button");
    });

    // The picker this replaced was cancelled outright by a non-TTY, and the cancellation
    // was reported as exit 0 with nothing printed.
    it("exits 2 and prints the candidates when a query matches several documents", async () => {
      const result = await runDocsCommand(["action-button"]);

      expect(result.exitCode).toBe(2);
      expect(result.stdout).toContain("lynx/components/action-button");
      expect(result.stdout).toContain("react/components/action-button");
    });

    it("exits 1 when a query matches nothing", async () => {
      const result = await runDocsCommand(["react/components/nope"]);

      expect(result.exitCode).toBe(1);
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
    // it used to land on stdout — after the document body, under --raw.
    it("keeps the telemetry notice off stdout", async () => {
      const result = await runDocsCommand(["react/components/action-button", "--raw"], {
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

  describe("--raw", () => {
    it("serves the overview of a category that publishes one", async () => {
      const result = await runDocsCommand(["react", "--raw"]);

      expectSuccess(result);
      expect(result.stdout.trim()).toBe("# served /react/llms.txt");
    });

    // The archived sites' indexes predate llmsIndexUrl, so this is the shape that used to
    // leak the picker's own UI into stdout and still exit 0.
    it("exits 2 with an empty stdout for a category that publishes none", async () => {
      const result = await runDocsCommand(["lynx", "--raw"]);

      expect(result.exitCode).toBe(2);
      expect(result.stdout).toBe("");
      expect(result.stderr).toContain("lynx/components/action-button");
    });

    it("prints the document body for a resolved item", async () => {
      const result = await runDocsCommand(["react/components/action-button", "--raw"]);

      expectSuccess(result);
      expect(result.stdout.trim()).toBe("# served /llms/react/components/action-button.txt");
    });

    it("composes a URL for a changelog path the index cannot carry", async () => {
      const result = await runDocsCommand(["react/updates/changelog/react/1.2.5", "--raw"]);

      expectSuccess(result);
      expect(result.stdout.trim()).toBe("# served /llms/react/updates/changelog/react/1.2.5.txt");
    });

    it("exits 1 when a query matches nothing", async () => {
      const result = await runDocsCommand(["react/components/nope", "--raw"]);

      expect(result.exitCode).toBe(1);
      expect(result.stdout).toBe("");
    });
  });
});
