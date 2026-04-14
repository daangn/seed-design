#!/usr/bin/env node
import { cac } from 'cac';
import { mkdirSync, writeFileSync, readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, isAbsolute, relative, normalize, join, extname } from 'node:path';
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
    ".json": "application/json"
};
function serveCommand(cli) {
    cli.command("serve", "Start the Kontext dashboard").option("--root <dir>", "Repository root directory", {
        default: process.cwd()
    }).option("--port <port>", "Port number", {
        default: 4321
    }).action((options)=>{
        const rootDir = resolve(options.root);
        // #3: rootDir 기반으로 대시보드 경로를 해석 (import.meta.dirname 깊이에 무관)
        const dashboardDir = resolve(rootDir, "ecosystem/kontext/dashboard/dist");
        const dashboardDirPrefix = dashboardDir + "/";
        const graph = buildGraph({
            rootDir
        });
        const graphJson = JSON.stringify(graph);
        const server = createServer((req, res)=>{
            const url = req.url ?? "/";
            if (url === "/api/graph") {
                res.writeHead(200, {
                    "Content-Type": "application/json"
                });
                res.end(graphJson);
                return;
            }
            // #2: normalize + relative 기반 containment 체크로 sibling prefix 우회 방지
            const sanitizedUrl = normalize(url).replace(/^(\.\.[/\\])+/, "");
            const filePath = url === "/" ? join(dashboardDir, "index.html") : join(dashboardDir, sanitizedUrl);
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
