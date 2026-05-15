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
              snippetKey: "lynx/ui:checkbox",
              snippets: [{ label: "checkbox", path: "checkbox.tsx" }],
            },
          ],
        },
      ],
    },
  ],
};

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

  async function runDocsCommand(args: string[]) {
    const proc = Bun.spawn({
      cmd: [
        process.execPath,
        "packages/cli/src/index.ts",
        "docs",
        ...args,
        "-u",
        baseUrl,
      ],
      cwd: repoRoot,
      env: {
        ...process.env,
        DISABLE_TELEMETRY: "true",
        FORCE_COLOR: "0",
      },
      stderr: "pipe",
      stdout: "pipe",
    });

    const [exitCode, stdout, stderr] = await Promise.all([
      proc.exited,
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text(),
    ]);
    return { exitCode, stderr, stdout };
  }

  it("resolves unquoted Lynx component queries to docs and llms links", async () => {
    requests.length = 0;
    const result = await runDocsCommand(["lynx", "action-button"]);

    if (result.exitCode !== 0) {
      throw new Error(
        `docs command failed\nbaseUrl:${baseUrl}\nrequests:${requests.join(",")}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
      );
    }
    expect(result.stdout).toContain("- docs: http://");
    expect(result.stdout).toContain("/lynx/components/action-button");
    expect(result.stdout).toContain("- llms.txt: http://");
    expect(result.stdout).toContain("/llms/lynx/components/action-button.txt");
    expect(result.stdout).not.toContain("- snippet:");
  });

  it("prints Lynx snippet URLs for quoted Lynx component queries", async () => {
    requests.length = 0;
    const result = await runDocsCommand(["lynx checkbox"]);

    if (result.exitCode !== 0) {
      throw new Error(
        `docs command failed\nbaseUrl:${baseUrl}\nrequests:${requests.join(",")}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
      );
    }
    expect(result.stdout).toContain("- docs: http://");
    expect(result.stdout).toContain("/lynx/components/checkbox");
    expect(result.stdout).toContain("- llms.txt: http://");
    expect(result.stdout).toContain("/llms/lynx/components/checkbox.txt");
    expect(result.stdout).toContain(
      "- snippet: https://raw.githubusercontent.com/daangn/seed-design/refs/heads/dev/docs/registry/lynx/ui/checkbox.tsx",
    );
  });
});
