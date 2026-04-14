import type { CAC } from "cac";
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { resolve, join, extname, normalize } from "node:path";
import { buildGraph } from "@kontext/core";
import pc from "picocolors";

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
};

export function serveCommand(cli: CAC) {
  cli
    .command("serve", "Start the Kontext dashboard")
    .option("--root <dir>", "Repository root directory", { default: process.cwd() })
    .option("--port <port>", "Port number", { default: 4321 })
    .action((options: { root: string; port: number }) => {
      const rootDir = resolve(options.root);
      // #3: rootDir 기반으로 대시보드 경로를 해석 (import.meta.dirname 깊이에 무관)
      const dashboardDir = resolve(rootDir, "ecosystem/kontext/dashboard/dist");
      const dashboardDirPrefix = dashboardDir + "/";

      const graph = buildGraph({ rootDir });
      const graphJson = JSON.stringify(graph);

      const server = createServer((req, res) => {
        const url = req.url ?? "/";

        if (url === "/api/graph") {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(graphJson);
          return;
        }

        // #2: normalize + relative 기반 containment 체크로 sibling prefix 우회 방지
        const sanitizedUrl = normalize(url).replace(/^(\.\.[/\\])+/, "");
        const filePath =
          url === "/" ? join(dashboardDir, "index.html") : join(dashboardDir, sanitizedUrl);

        const resolvedPath = resolve(filePath);
        if (resolvedPath !== dashboardDir && !resolvedPath.startsWith(dashboardDirPrefix)) {
          res.writeHead(403);
          res.end("Forbidden");
          return;
        }

        // #7: 디렉토리 요청 시 EISDIR 방지
        if (existsSync(resolvedPath) && statSync(resolvedPath).isFile()) {
          const ext = extname(resolvedPath);
          const mime = MIME_TYPES[ext] ?? "application/octet-stream";
          res.writeHead(200, { "Content-Type": mime });
          res.end(readFileSync(resolvedPath));
        } else {
          const indexPath = join(dashboardDir, "index.html");
          if (existsSync(indexPath)) {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(readFileSync(indexPath));
          } else {
            res.writeHead(404);
            res.end("Dashboard not built. Run: bun --filter @kontext/dashboard build");
          }
        }
      });

      server.listen(options.port, () => {
        console.log(
          `${pc.green("●")} Kontext dashboard running at ${pc.cyan(`http://localhost:${options.port}`)}`,
        );
        console.log(`  ${pc.dim(`${graph.nodes.length} nodes, ${graph.edges.length} edges`)}`);
      });
    });
}
