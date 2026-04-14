import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { resolve, relative, join } from "node:path";
import { execSync } from "node:child_process";

const input = readFileSync("/dev/stdin", "utf-8");
const { tool_response } = JSON.parse(input);
const filePath: string = tool_response?.filePath;

if (!filePath) process.exit(0);

const rootDir = resolve(import.meta.dirname, "../..");
const relPath = relative(rootDir, resolve(filePath));

// kontext 자체 파일 편집은 무시
if (relPath.startsWith("ecosystem/kontext/") || relPath.startsWith(".kontext/")) {
  process.exit(0);
}

// #4: 그래프 로드 + 캐시 invalidation (kontext.yaml이 더 새로우면 재빌드)
const graphPath = resolve(rootDir, ".kontext/graph.json");

function needsRebuild(): boolean {
  if (!existsSync(graphPath)) return true;
  const graphMtime = statSync(graphPath).mtimeMs;
  // kontext.yaml 파일들의 최신 mtime 찾기
  try {
    const findYaml = (dir: string): number => {
      let maxMtime = 0;
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (["node_modules", ".git", "dist", "lib"].includes(entry.name)) continue;
        const full = join(dir, entry.name);
        if (entry.isDirectory()) maxMtime = Math.max(maxMtime, findYaml(full));
        else if (entry.name === "kontext.yaml")
          maxMtime = Math.max(maxMtime, statSync(full).mtimeMs);
      }
      return maxMtime;
    };
    return findYaml(rootDir) > graphMtime;
  } catch {
    return true;
  }
}

if (needsRebuild()) {
  try {
    execSync("bun ecosystem/kontext/cli/bin/kontext.mjs build", {
      cwd: rootDir,
      stdio: "ignore",
      timeout: 10000,
    });
  } catch {
    process.exit(0);
  }
}
if (!existsSync(graphPath)) process.exit(0);

interface GraphEdge {
  source: string;
  target: string;
  reason?: string;
  generated: boolean;
  command?: string;
}

interface KontextGraph {
  edges: GraphEdge[];
}

let graph: KontextGraph;
try {
  graph = JSON.parse(readFileSync(graphPath, "utf-8"));
} catch {
  process.exit(0);
}

// 해당 파일이 source인 엣지 찾기
const deps = graph.edges.filter((e) => e.source === relPath);
if (deps.length === 0) process.exit(0);

// 결과 포맷팅
const autoItems = deps.filter((d) => d.generated);
const manualItems = deps.filter((d) => !d.generated);

const lines: string[] = [];
lines.push(`KONTEXT: ${relPath}을(를) 수정했습니다.`);

if (manualItems.length > 0) {
  lines.push("  영향받는 파일:");
  for (const item of manualItems) {
    const exists = existsSync(resolve(rootDir, item.target));
    const icon = exists ? "●" : "○";
    lines.push(`  ${icon} ${item.target}${item.reason ? ` (${item.reason})` : ""}`);
  }
}

if (autoItems.length > 0) {
  lines.push("  자동 생성 (명령 실행 필요):");
  for (const item of autoItems) {
    lines.push(`  ⚡ ${item.target} → ${item.command ?? "bun generate:all"}`);
  }
}

// exit 0 + stdout JSON으로 additionalContext 전달
// 에이전트가 다음 행동에 이 맥락을 참고함
const output = {
  additionalContext: lines.join("\n"),
};
console.log(JSON.stringify(output));
process.exit(0);
