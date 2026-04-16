import type { CAC } from "cac";
import { createServer, type IncomingMessage } from "node:http";
import { readFileSync, existsSync, statSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, join, extname, normalize, dirname } from "node:path";
import { buildGraph } from "@kontext/core";
import pc from "picocolors";

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".svg": "image/svg+xml",
};

const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "lib", ".kontext", ".next", ".turbo"]);

function jsonResponse(res: import("node:http").ServerResponse, statusCode: number, data: unknown) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(data));
}

function parseBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Body too large"));
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function isPathSafe(targetPath: string, rootDir: string): boolean {
  const normalized = normalize(targetPath);
  const rootPrefix = rootDir + "/";
  return normalized === rootDir || normalized.startsWith(rootPrefix);
}

export function serveCommand(cli: CAC) {
  cli
    .command("serve", "Start the Kontext dashboard")
    .option("--root <dir>", "Repository root directory", {
      default: process.cwd(),
    })
    .option("--port <port>", "Port number", { default: 4321 })
    .action(async (options: { root: string; port: number }) => {
      const rootDir = resolve(options.root);
      const dashboardDir = resolve(rootDir, "ecosystem/kontext/dashboard/dist");
      const dashboardDirPrefix = dashboardDir + "/";

      // Mutable graph cache
      let graph = buildGraph({ rootDir });
      let graphJson = JSON.stringify(graph);

      const server = createServer(async (req, res) => {
        const rawUrl = req.url ?? "/";
        const [urlPath, queryString] = rawUrl.split("?");
        const url = urlPath ?? "/";
        const method = req.method ?? "GET";
        const params = new URLSearchParams(queryString ?? "");

        // CORS headers for API
        if (url.startsWith("/api/")) {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
          res.setHeader("Access-Control-Allow-Headers", "Content-Type");
          if (method === "OPTIONS") {
            res.writeHead(204);
            res.end();
            return;
          }
        }

        try {
          // --- API: GET /api/graph ---
          if (url === "/api/graph" && method === "GET") {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(graphJson);
            return;
          }

          // --- API: GET /api/workspaces ---
          if (url === "/api/workspaces" && method === "GET") {
            try {
              const pkgPath = join(rootDir, "package.json");
              const pkgJson = JSON.parse(readFileSync(pkgPath, "utf-8"));
              const workspaceGlobs: string[] = pkgJson.workspaces ?? [];
              const workspaces: string[] = [];

              for (const pattern of workspaceGlobs) {
                if (pattern.endsWith("/*")) {
                  // Expand glob
                  const dir = join(rootDir, pattern.slice(0, -2));
                  if (existsSync(dir) && statSync(dir).isDirectory()) {
                    for (const entry of readdirSync(dir, { withFileTypes: true })) {
                      if (entry.isDirectory()) {
                        const wsPath = join(dir, entry.name, "package.json");
                        if (existsSync(wsPath)) {
                          workspaces.push(pattern.slice(0, -2) + "/" + entry.name);
                        }
                      }
                    }
                  }
                } else {
                  // Direct path
                  const wsPath = join(rootDir, pattern, "package.json");
                  if (existsSync(wsPath)) {
                    workspaces.push(pattern);
                  }
                }
              }

              jsonResponse(res, 200, workspaces.sort());
            } catch {
              jsonResponse(res, 200, []);
            }
            return;
          }

          // --- API: GET /api/files ---
          if (url === "/api/files" && method === "GET") {
            const dir = params.get("dir") ?? "";
            const targetDir = dir ? join(rootDir, dir) : rootDir;

            if (!isPathSafe(targetDir, rootDir)) {
              jsonResponse(res, 403, { error: "Forbidden" });
              return;
            }

            if (!existsSync(targetDir) || !statSync(targetDir).isDirectory()) {
              jsonResponse(res, 404, { error: "Directory not found" });
              return;
            }

            const entries = readdirSync(targetDir, { withFileTypes: true })
              .filter((e) => !SKIP_DIRS.has(e.name) && !e.name.startsWith("."))
              .map((e) => ({
                name: e.name,
                type: e.isDirectory() ? "directory" : "file",
                path: dir ? `${dir}/${e.name}` : e.name,
              }))
              .sort((a, b) => {
                if (a.type !== b.type) return a.type === "directory" ? -1 : 1;
                return a.name.localeCompare(b.name);
              });

            jsonResponse(res, 200, entries);
            return;
          }

          // --- API: GET /api/file-content ---
          if (url === "/api/file-content" && method === "GET") {
            const filePath = params.get("path") ?? "";
            if (!filePath) {
              jsonResponse(res, 400, { error: "Missing path parameter" });
              return;
            }

            const targetPath = join(rootDir, filePath);
            if (!isPathSafe(targetPath, rootDir)) {
              jsonResponse(res, 403, { error: "Forbidden" });
              return;
            }

            if (!existsSync(targetPath) || !statSync(targetPath).isFile()) {
              jsonResponse(res, 404, { error: "File not found" });
              return;
            }

            const stat = statSync(targetPath);
            if (stat.size > 512 * 1024) {
              jsonResponse(res, 413, { error: "File too large (max 512KB)" });
              return;
            }

            const ext = extname(targetPath).toLowerCase();
            const binaryExts = new Set([
              ".png",
              ".jpg",
              ".jpeg",
              ".gif",
              ".webp",
              ".ico",
              ".svg",
              ".woff",
              ".woff2",
              ".ttf",
              ".eot",
              ".otf",
              ".wasm",
              ".zip",
              ".tar",
              ".gz",
              ".br",
              ".pdf",
              ".mp3",
              ".mp4",
              ".webm",
            ]);
            if (binaryExts.has(ext)) {
              jsonResponse(res, 415, { error: "Binary file", binary: true });
              return;
            }

            try {
              const content = readFileSync(targetPath, "utf-8");
              jsonResponse(res, 200, { content, path: filePath, size: stat.size, extension: ext });
            } catch {
              jsonResponse(res, 500, { error: "Failed to read file" });
            }
            return;
          }

          // --- API: GET/POST /api/config/:packageDir ---
          const configMatch = url.match(/^\/api\/config\/(.+)$/);
          if (configMatch) {
            const packageDir = decodeURIComponent(configMatch[1]!);
            const configPath = join(rootDir, packageDir, "kontext.yaml");

            if (!isPathSafe(configPath, rootDir)) {
              jsonResponse(res, 403, { error: "Forbidden" });
              return;
            }

            if (method === "GET") {
              if (existsSync(configPath) && statSync(configPath).isFile()) {
                const content = readFileSync(configPath, "utf-8");
                jsonResponse(res, 200, { content, exists: true });
              } else {
                jsonResponse(res, 200, { content: "", exists: false });
              }
              return;
            }

            if (method === "POST") {
              const body = await parseBody(req);
              const { content } = JSON.parse(body) as { content: string };

              const dir = dirname(configPath);
              if (!existsSync(dir)) {
                mkdirSync(dir, { recursive: true });
              }
              writeFileSync(configPath, content, "utf-8");
              jsonResponse(res, 200, { success: true });
              return;
            }
          }

          // --- API: POST /api/rebuild ---
          if (url === "/api/rebuild" && method === "POST") {
            graph = buildGraph({ rootDir });
            graphJson = JSON.stringify(graph);
            jsonResponse(res, 200, graph);
            return;
          }

          // --- Static file serving ---
          const sanitizedUrl = normalize(url).replace(/^(\.\.[/\\])+/, "");
          const filePath =
            url === "/" ? join(dashboardDir, "index.html") : join(dashboardDir, sanitizedUrl);

          const resolvedPath = resolve(filePath);
          if (resolvedPath !== dashboardDir && !resolvedPath.startsWith(dashboardDirPrefix)) {
            res.writeHead(403);
            res.end("Forbidden");
            return;
          }

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
        } catch (err) {
          console.error(pc.red("Server error:"), err);
          jsonResponse(res, 500, {
            error: err instanceof Error ? err.message : "Internal error",
          });
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
