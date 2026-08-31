import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { createServer, type Server } from "node:http";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dir, "../../../..");

/**
 * `bottom-sheet` sits in two sections of one category, `sheet` is a fragment of three
 * different ids, and "Manner Temp Badge" carries a word its id does not — the three shapes
 * that make searching a different job from resolving an address.
 */
const docsIndex = {
  categories: [
    {
      id: "components",
      label: "Components",
      sections: [
        {
          id: "components",
          label: "Components",
          items: [
            { id: "action-button", title: "Action Button", docUrl: "/components/action-button" },
            { id: "bottom-sheet", title: "Bottom Sheet", docUrl: "/components/bottom-sheet" },
            {
              id: "manner-temp",
              title: "Manner Temp & Manner Temp Badge",
              docUrl: "/components/manner-temp",
            },
            {
              id: "old-chip",
              title: "Old Chip",
              docUrl: "/components/old-chip",
              deprecated: true,
            },
          ],
        },
      ],
    },
    {
      id: "react",
      label: "React",
      sections: [
        {
          id: "components",
          label: "Components",
          items: [
            {
              id: "action-button",
              title: "Action Button",
              docUrl: "/react/components/action-button",
            },
            {
              id: "bottom-sheet",
              title: "Bottom Sheet",
              docUrl: "/react/components/bottom-sheet",
            },
          ],
        },
        {
          id: "stackflow",
          label: "Stackflow",
          items: [
            {
              id: "bottom-sheet",
              title: "Bottom Sheet",
              docUrl: "/react/stackflow/bottom-sheet",
            },
          ],
        },
      ],
    },
  ],
};

describe("docs-search command", () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    server = createServer((request, response) => {
      const pathname = request.url ? new URL(request.url, "http://127.0.0.1").pathname : "/";

      if (pathname === "/__docs__/index.json") {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(docsIndex));
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

  async function runDocsSearchCommand(args: string[]) {
    const proc = Bun.spawn({
      cmd: [process.execPath, "packages/cli/src/index.ts", "docs-search", ...args, "-u", baseUrl],
      cwd: repoRoot,
      env: { ...process.env, DISABLE_TELEMETRY: "true", FORCE_COLOR: "0" },
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

  // Several results is what a name is for, so it is an answer rather than a failure. This
  // is the whole difference from `docs`, which refuses a name outright.
  it("exits 0 and lists every address a name reaches", async () => {
    const result = await runDocsSearchCommand(["bottom-sheet"]);

    expect(result.exitCode).toBe(0);
    expect(result.stdout.split("\n").filter(Boolean)).toHaveLength(3);
    expect(result.stdout).toContain("components/bottom-sheet");
    expect(result.stdout).toContain("react/components/bottom-sheet");
    expect(result.stdout).toContain("react/stackflow/bottom-sheet");
  });

  it("matches a fragment of an id", async () => {
    const result = await runDocsSearchCommand(["sheet"]);

    expect(result.exitCode).toBe(0);
    expect(result.stdout.split("\n").filter(Boolean)).toHaveLength(3);
  });

  it("matches a word carried only by the title", async () => {
    const result = await runDocsSearchCommand(["badge"]);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("components/manner-temp");
  });

  it("prints the title beside each address", async () => {
    const result = await runDocsSearchCommand(["manner-temp"]);

    expect(result.stdout.trim()).toBe("components/manner-temp  Manner Temp & Manner Temp Badge");
  });

  it("marks a deprecated document", async () => {
    const result = await runDocsSearchCommand(["old-chip"]);

    expect(result.stdout).toContain("(deprecated)");
  });

  // The addresses are the answer, so they go to stdout alone and stay pipeable into `docs`.
  it("keeps the count off stdout", async () => {
    const result = await runDocsSearchCommand(["bottom-sheet"]);

    expect(result.stderr).toContain("3개 문서를 찾았어요.");
    expect(result.stdout).not.toContain("3개 문서");
  });

  it("exits 1 with an empty stdout when nothing matches", async () => {
    const result = await runDocsSearchCommand(["nothing-like-this"]);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
  });

  it("exits 1 when given no name", async () => {
    const result = await runDocsSearchCommand([]);

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("찾을 이름이 필요해요.");
  });
});
