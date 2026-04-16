#!/usr/bin/env node
import { cac } from 'cac';
import { mkdirSync, writeFileSync, readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { resolve, isAbsolute, relative, join, extname, dirname, normalize } from 'node:path';
import { buildGraph, checkCompleteness, findDeps, lint } from '@kontext/core';
import pc from 'picocolors';
import { createServer } from 'node:http';

function buildCommand(cli) {
    cli.command("build", "Build the dependency graph from all kontext.yaml files").option("--root <dir>", "Repository root directory", {
        default: process.cwd()
    }).action((options)=>{
        const rootDir = resolve(options.root);
        console.log(pc.dim("Scanning for kontext.yaml files..."));
        const graph = buildGraph({
            rootDir
        });
        const outDir = resolve(rootDir, ".kontext");
        mkdirSync(outDir, {
            recursive: true
        });
        const outPath = resolve(outDir, "graph.json");
        writeFileSync(outPath, JSON.stringify(graph, null, 2));
        console.log(`${pc.green("✓")} Graph built: ${pc.bold(String(graph.nodes.length))} nodes, ${pc.bold(String(graph.edges.length))} edges`);
        console.log(`  ${pc.dim("Packages:")} ${graph.packages.join(", ")}`);
        console.log(`  ${pc.dim("Output:")} ${outPath}`);
    });
}

function renderDepsTree(filePath, deps) {
    const lines = [];
    lines.push(pc.bold(filePath));
    for(let i = 0; i < deps.length; i++){
        const dep = deps[i];
        const isLast = i === deps.length - 1;
        const prefix = isLast ? "└─" : "├─";
        const existsIcon = dep.exists ? pc.green("●") : pc.red("○");
        let label = "";
        if (dep.generated) {
            label = `${pc.cyan("[auto]")} ${dep.path}`;
            if (dep.command) {
                label += ` ${pc.dim(`→ ${dep.command}`)}`;
            }
        } else {
            label = dep.path;
            if (dep.reason) {
                label += ` ${pc.dim(`— ${dep.reason}`)}`;
            }
        }
        lines.push(`${prefix} ${existsIcon} ${label}`);
    }
    return lines.join("\n");
}
function renderCheckResults(results) {
    const lines = [];
    // definedBy별로 그룹핑
    const bySource = new Map();
    for (const result of results){
        const key = result.definedBy;
        const list = bySource.get(key) ?? [];
        list.push(result);
        bySource.set(key, list);
    }
    for (const [definedBy, group] of bySource){
        lines.push(pc.dim(`── ${definedBy} ──`));
        for (const result of group){
            if (result.missing.length === 0) {
                lines.push(`${pc.green("✅")} ${result.source}: ${result.existing}/${result.total}`);
            } else {
                lines.push(`${pc.yellow("⚠️")}  ${result.source}: ${result.existing}/${result.total} — missing:`);
                for (const m of result.missing){
                    lines.push(`   ${pc.dim("└─")} ${pc.red(m)}`);
                }
            }
        }
        lines.push("");
    }
    return lines.join("\n");
}
function renderDepsJson(deps) {
    return JSON.stringify(deps, null, 2);
}
function renderLintResults(result) {
    const lines = [];
    if (result.suggestions.length > 0) {
        lines.push(pc.bold("Discovered relationships:"));
        lines.push("");
        // 레이어별 그룹핑
        for (const layer of [
            "naming",
            "import",
            "co-change"
        ]){
            const items = result.suggestions.filter((s)=>s.layer === layer);
            if (items.length === 0) continue;
            lines.push(pc.cyan(`  [${layer}] ${items.length} suggestions`));
            for (const item of items.slice(0, 10)){
                const conf = `${(item.confidence * 100).toFixed(0)}%`;
                lines.push(`  ${pc.dim("├─")} ${item.source} ${pc.dim("↔")} ${item.target}`);
                lines.push(`  ${pc.dim("│")}  ${pc.dim(item.detail)} ${pc.dim(`(${conf})`)}`);
            }
            if (items.length > 10) {
                lines.push(`  ${pc.dim(`└─ ... and ${items.length - 10} more`)}`);
            }
            lines.push("");
        }
    } else {
        lines.push(pc.green("No undeclared relationships found."));
    }
    if (result.staleWarnings.length > 0) {
        lines.push(pc.bold("Stale relationships:"));
        lines.push("");
        for (const warn of result.staleWarnings.slice(0, 10)){
            lines.push(`  ${pc.yellow("⚠")} ${warn.source} ${pc.dim("→")} ${warn.target}`);
            lines.push(`    ${pc.dim(warn.reason)}`);
        }
        if (result.staleWarnings.length > 10) {
            lines.push(`  ${pc.dim(`... and ${result.staleWarnings.length - 10} more`)}`);
        }
    }
    return lines.join("\n");
}

function loadOrBuildGraph(rootDir) {
    const graphPath = resolve(rootDir, ".kontext", "graph.json");
    try {
        const raw = readFileSync(graphPath, "utf-8");
        return JSON.parse(raw);
    } catch  {
        return buildGraph({
            rootDir
        });
    }
}

function checkCommand(cli) {
    cli.command("check", "Verify all affected paths exist").option("--root <dir>", "Repository root directory", {
        default: process.cwd()
    }).option("--ci", "Exit with code 1 if any files are missing").action((options)=>{
        const rootDir = resolve(options.root);
        const graph = loadOrBuildGraph(rootDir);
        const results = checkCompleteness(graph);
        const hasMissing = results.some((r)=>r.missing.length > 0);
        console.log(renderCheckResults(results));
        if (hasMissing) {
            console.log("");
            console.log(pc.yellow("Some affected files are missing."));
            if (options.ci) {
                process.exit(1);
            }
        } else {
            console.log("");
            console.log(pc.green("All affected files exist."));
        }
    });
}

function depsCommand(cli) {
    cli.command("deps <file>", "Show all files affected by changes to <file>").option("--root <dir>", "Repository root directory", {
        default: process.cwd()
    }).option("--json", "Output as JSON").action((file, options)=>{
        const rootDir = resolve(options.root);
        const graph = loadOrBuildGraph(rootDir);
        const absFile = isAbsolute(file) ? file : resolve(rootDir, file);
        const relFile = relative(rootDir, absFile);
        const deps = findDeps(graph, relFile);
        if (deps.length === 0) {
            console.log(`No relations found for ${relFile}`);
            console.log("Tip: Make sure the file matches a 'when' pattern in a kontext.yaml");
            return;
        }
        if (options.json) {
            console.log(renderDepsJson(deps));
        } else {
            console.log(renderDepsTree(relFile, deps));
        }
    });
}

function lintCommand(cli) {
    cli.command("lint", "Discover undeclared relationships from git history, naming patterns, and imports").option("--root <dir>", "Repository root directory", {
        default: process.cwd()
    }).option("--commits <n>", "Number of commits to analyze", {
        default: 200
    }).option("--threshold <n>", "Jaccard similarity threshold", {
        default: 0.7
    }).option("--min-co <n>", "Minimum co-occurrences", {
        default: 3
    }).option("--json", "Output as JSON").option("--fix", "Auto-apply suggestions to kontext.yaml files (experimental, not yet implemented)").action((options)=>{
        const rootDir = resolve(options.root);
        if (!options.json) {
            console.log(pc.dim("Analyzing repository..."));
        }
        const result = lint({
            rootDir,
            commitCount: options.commits,
            jaccardThreshold: options.threshold,
            minCoOccurrences: options.minCo
        });
        if (options.json) {
            console.log(JSON.stringify(result, null, 2));
            return;
        }
        console.log(renderLintResults(result));
        if (result.suggestions.length > 0 && !options.fix) {
            console.log("");
            console.log(pc.dim("Apply suggestions with: kontext lint --fix"));
        }
        if (options.fix && result.suggestions.length > 0) {
            console.log("");
            console.log(pc.yellow("--fix is not yet implemented. Coming soon."));
        }
    });
}

const MIME_TYPES = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".mjs": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".woff2": "font/woff2",
    ".woff": "font/woff",
    ".ttf": "font/ttf",
    ".svg": "image/svg+xml"
};
const SKIP_DIRS = new Set([
    "node_modules",
    ".git",
    "dist",
    "lib",
    ".kontext",
    ".next",
    ".turbo"
]);
const BINARY_EXTS = new Set([
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
    ".webm"
]);
function jsonResponse(res, statusCode, data) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });
    res.end(JSON.stringify(data));
}
function parseBody(req) {
    return new Promise((resolve, reject)=>{
        let body = "";
        req.on("data", (chunk)=>{
            body += chunk;
            if (body.length > 1_000_000) {
                reject(new Error("Body too large"));
            }
        });
        req.on("end", ()=>resolve(body));
        req.on("error", reject);
    });
}
function isPathSafe(targetPath, rootDir) {
    const normalized = normalize(targetPath);
    const rootPrefix = rootDir + "/";
    return normalized === rootDir || normalized.startsWith(rootPrefix);
}
function serveCommand(cli) {
    cli.command("serve", "Start the Kontext dashboard").option("--root <dir>", "Repository root directory", {
        default: process.cwd()
    }).option("--port <port>", "Port number", {
        default: 4321
    }).action(async (options)=>{
        const rootDir = resolve(options.root);
        const dashboardDir = resolve(rootDir, "ecosystem/kontext/dashboard/dist");
        const dashboardDirPrefix = dashboardDir + "/";
        // Mutable graph cache
        let graph = buildGraph({
            rootDir
        });
        let graphJson = JSON.stringify(graph);
        const server = createServer(async (req, res)=>{
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
                    res.writeHead(200, {
                        "Content-Type": "application/json"
                    });
                    res.end(graphJson);
                    return;
                }
                // --- API: GET /api/workspaces ---
                if (url === "/api/workspaces" && method === "GET") {
                    try {
                        const pkgPath = join(rootDir, "package.json");
                        const pkgJson = JSON.parse(readFileSync(pkgPath, "utf-8"));
                        const workspaceGlobs = pkgJson.workspaces ?? [];
                        const workspaces = [];
                        for (const pattern of workspaceGlobs){
                            if (pattern.endsWith("/*")) {
                                // Expand glob
                                const dir = join(rootDir, pattern.slice(0, -2));
                                if (existsSync(dir) && statSync(dir).isDirectory()) {
                                    for (const entry of readdirSync(dir, {
                                        withFileTypes: true
                                    })){
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
                    } catch  {
                        jsonResponse(res, 200, []);
                    }
                    return;
                }
                // --- API: GET /api/files ---
                if (url === "/api/files" && method === "GET") {
                    const dir = params.get("dir") ?? "";
                    const targetDir = dir ? join(rootDir, dir) : rootDir;
                    if (!isPathSafe(targetDir, rootDir)) {
                        jsonResponse(res, 403, {
                            error: "Forbidden"
                        });
                        return;
                    }
                    if (!existsSync(targetDir) || !statSync(targetDir).isDirectory()) {
                        jsonResponse(res, 404, {
                            error: "Directory not found"
                        });
                        return;
                    }
                    const entries = readdirSync(targetDir, {
                        withFileTypes: true
                    }).filter((e)=>!SKIP_DIRS.has(e.name) && !e.name.startsWith(".")).map((e)=>({
                            name: e.name,
                            type: e.isDirectory() ? "directory" : "file",
                            path: dir ? `${dir}/${e.name}` : e.name
                        })).sort((a, b)=>{
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
                        jsonResponse(res, 400, {
                            error: "Missing path parameter"
                        });
                        return;
                    }
                    const targetPath = join(rootDir, filePath);
                    if (!isPathSafe(targetPath, rootDir)) {
                        jsonResponse(res, 403, {
                            error: "Forbidden"
                        });
                        return;
                    }
                    let stat;
                    try {
                        stat = statSync(targetPath);
                    } catch  {
                        jsonResponse(res, 404, {
                            error: "File not found"
                        });
                        return;
                    }
                    if (!stat.isFile()) {
                        jsonResponse(res, 404, {
                            error: "File not found"
                        });
                        return;
                    }
                    if (stat.size > 512 * 1024) {
                        jsonResponse(res, 413, {
                            error: "File too large (max 512KB)"
                        });
                        return;
                    }
                    const ext = extname(targetPath).toLowerCase();
                    if (BINARY_EXTS.has(ext)) {
                        jsonResponse(res, 415, {
                            error: "Binary file",
                            binary: true
                        });
                        return;
                    }
                    try {
                        const content = readFileSync(targetPath, "utf-8");
                        jsonResponse(res, 200, {
                            content,
                            path: filePath,
                            size: stat.size,
                            extension: ext
                        });
                    } catch  {
                        jsonResponse(res, 500, {
                            error: "Failed to read file"
                        });
                    }
                    return;
                }
                // --- API: GET/POST /api/config/:packageDir ---
                const configMatch = url.match(/^\/api\/config\/(.+)$/);
                if (configMatch) {
                    const packageDir = decodeURIComponent(configMatch[1]);
                    const configPath = join(rootDir, packageDir, "kontext.yaml");
                    if (!isPathSafe(configPath, rootDir)) {
                        jsonResponse(res, 403, {
                            error: "Forbidden"
                        });
                        return;
                    }
                    if (method === "GET") {
                        if (existsSync(configPath) && statSync(configPath).isFile()) {
                            const content = readFileSync(configPath, "utf-8");
                            jsonResponse(res, 200, {
                                content,
                                exists: true
                            });
                        } else {
                            jsonResponse(res, 200, {
                                content: "",
                                exists: false
                            });
                        }
                        return;
                    }
                    if (method === "POST") {
                        const body = await parseBody(req);
                        const { content } = JSON.parse(body);
                        const dir = dirname(configPath);
                        mkdirSync(dir, {
                            recursive: true
                        });
                        writeFileSync(configPath, content, "utf-8");
                        jsonResponse(res, 200, {
                            success: true
                        });
                        return;
                    }
                }
                // --- API: POST /api/rebuild ---
                if (url === "/api/rebuild" && method === "POST") {
                    graph = buildGraph({
                        rootDir
                    });
                    graphJson = JSON.stringify(graph);
                    jsonResponse(res, 200, graph);
                    return;
                }
                // --- Static file serving ---
                const sanitizedUrl = normalize(url).replace(/^(\.\.[/\\])+/, "");
                const filePath = url === "/" ? join(dashboardDir, "index.html") : join(dashboardDir, sanitizedUrl);
                const resolvedPath = resolve(filePath);
                if (resolvedPath !== dashboardDir && !resolvedPath.startsWith(dashboardDirPrefix)) {
                    res.writeHead(403);
                    res.end("Forbidden");
                    return;
                }
                if (existsSync(resolvedPath) && statSync(resolvedPath).isFile()) {
                    const ext = extname(resolvedPath);
                    const mime = MIME_TYPES[ext] ?? "application/octet-stream";
                    res.writeHead(200, {
                        "Content-Type": mime
                    });
                    res.end(readFileSync(resolvedPath));
                } else {
                    const indexPath = join(dashboardDir, "index.html");
                    if (existsSync(indexPath)) {
                        res.writeHead(200, {
                            "Content-Type": "text/html"
                        });
                        res.end(readFileSync(indexPath));
                    } else {
                        res.writeHead(404);
                        res.end("Dashboard not built. Run: bun --filter @kontext/dashboard build");
                    }
                }
            } catch (err) {
                console.error(pc.red("Server error:"), err);
                jsonResponse(res, 500, {
                    error: err instanceof Error ? err.message : "Internal error"
                });
            }
        });
        server.listen(options.port, ()=>{
            console.log(`${pc.green("●")} Kontext dashboard running at ${pc.cyan(`http://localhost:${options.port}`)}`);
            console.log(`  ${pc.dim(`${graph.nodes.length} nodes, ${graph.edges.length} edges`)}`);
        });
    });
}

const cli = cac("kontext");
buildCommand(cli);
depsCommand(cli);
checkCommand(cli);
lintCommand(cli);
serveCommand(cli);
cli.version("0.0.0", "-v, --version");
cli.help();
cli.parse();
