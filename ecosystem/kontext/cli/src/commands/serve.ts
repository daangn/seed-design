import type { CAC } from "cac";
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { resolve, join, extname } from "node:path";
import { buildGraph } from "@kontext/core";
import pc from "picocolors";

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".tsx": "application/javascript",
};

export function serveCommand(cli: CAC) {
  cli
    .command("serve", "Start the Kontext dashboard")
    .option("--root <dir>", "Repository root directory", { default: process.cwd() })
    .option("--port <port>", "Port number", { default: 4321 })
    .action((options: { root: string; port: number }) => {
      const rootDir = resolve(options.root);
      const dashboardDir = resolve(import.meta.dirname ?? __dirname, "../../dashboard/dist");

      const graph = buildGraph({ rootDir });
      const graphJson = JSON.stringify(graph);

      const server = createServer((req, res) => {
        const url = req.url ?? "/";

        // API: graph data
        if (url === "/api/graph") {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(graphJson);
          return;
        }

        // Static files from dashboard dist
        const filePath =
          url === "/" ? join(dashboardDir, "index.html") : resolve(dashboardDir, `.${url}`);

        if (!filePath.startsWith(dashboardDir)) {
          res.writeHead(403);
          res.end("Forbidden");
          return;
        }

        if (existsSync(filePath)) {
          const ext = extname(filePath);
          const mime = MIME_TYPES[ext] ?? "application/octet-stream";
          res.writeHead(200, { "Content-Type": mime });
          res.end(readFileSync(filePath));
        } else {
          // SPA fallback
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
