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

      if (/^\/react\/v(?:1\.[012]|2)\/__docs__\/index.json$/.test(pathname)) {
        const archived = JSON.parse(JSON.stringify(docsIndex).replaceAll("lynx", "react"));
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(archived));
        return;
      }
      if (/^\/react\/v(?:1\.[012]|2)\/llms\/react\/components\/checkbox.txt$/.test(pathname)) {
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.end("# Archived Checkbox");
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

  async function runDocsCommand(args: string[], sourceUrl = baseUrl) {
    const proc = Bun.spawn({
      cmd: [process.execPath, "packages/cli/src/index.ts", "docs", ...args, "-u", sourceUrl],
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

  it("resolves registry-key queries with an explicit framework", async () => {
    requests.length = 0;
    const result = await runDocsCommand(["ui:checkbox", "--framework", "lynx"]);

    if (result.exitCode !== 0) {
      throw new Error(
        `docs command failed\nbaseUrl:${baseUrl}\nrequests:${requests.join(",")}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
      );
    }
    expect(result.stdout).toContain("- docs: http://");
    expect(result.stdout).toContain("/lynx/components/checkbox");
    expect(result.stdout).toContain(
      "- snippet: https://raw.githubusercontent.com/daangn/seed-design/refs/heads/dev/docs/registry/lynx/ui/checkbox.tsx",
    );
  });
  it.each([
    "v1.0",
    "v1.1",
    "v1.2",
    "v2",
  ])("uses %s archive docs, LLM and source links", async (version) => {
    requests.length = 0;
    const sourceUrl = `${baseUrl}/react/${version}`;
    const result = await runDocsCommand(["react", "checkbox"], sourceUrl);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain(`- docs: ${sourceUrl}/components/checkbox`);
    expect(result.stdout).toContain(`- llms.txt: ${sourceUrl}/llms/react/components/checkbox.txt`);
    expect(result.stdout).toContain(
      `/refs/heads/react/${version}/docs/registry/react/ui/checkbox.tsx`,
    );
    expect(result.stdout).not.toContain(`/react/${version}/react/components`);
    const raw = await runDocsCommand(["react", "checkbox", "--raw"], sourceUrl);
    expect(raw.exitCode).toBe(0);
    expect(raw.stdout.trim()).toBe("# Archived Checkbox");
    expect(requests).toContain(`/react/${version}/llms/react/components/checkbox.txt`);
  }, 15000);
});
