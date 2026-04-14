import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { minimatch } from "minimatch";
import { buildGraph } from "./graph-builder.js";
import type {
  KontextGraph,
  LintOptions,
  LintResult,
  LintStaleWarning,
  LintSuggestion,
} from "./types.js";

const DEFAULT_COMMIT_COUNT = 200;
const DEFAULT_JACCARD_THRESHOLD = 0.7;
const DEFAULT_MIN_CO_OCCURRENCES = 3;
const DEFAULT_IGNORE_PATTERNS = [
  "node_modules/**",
  "dist/**",
  "lib/**",
  "bin/**",
  ".kontext/**",
  "*.lock",
  "bun.lock",
  ".changeset/**",
];

export function lint(options: LintOptions): LintResult {
  const {
    rootDir,
    commitCount = DEFAULT_COMMIT_COUNT,
    jaccardThreshold = DEFAULT_JACCARD_THRESHOLD,
    minCoOccurrences = DEFAULT_MIN_CO_OCCURRENCES,
    ignorePatterns = DEFAULT_IGNORE_PATTERNS,
  } = options;

  const graph = buildGraph({ rootDir });
  const declaredEdges = new Set(graph.edges.map((e) => edgeKey(e.source, e.target)));

  const suggestions: LintSuggestion[] = [];

  // Layer 1: 네이밍 매칭
  const namingSuggestions = analyzeNaming(rootDir, graph, declaredEdges);
  suggestions.push(...namingSuggestions);

  // Layer 2: Import 분석
  const importSuggestions = analyzeImports(rootDir, graph, declaredEdges);
  suggestions.push(...importSuggestions);

  // Layer 3: Git co-change
  const { coChangeSuggestions, staleWarnings } = analyzeCoChange(
    rootDir,
    graph,
    declaredEdges,
    commitCount,
    jaccardThreshold,
    minCoOccurrences,
    ignorePatterns,
  );
  suggestions.push(...coChangeSuggestions);

  // 중복 제거 (같은 source-target 쌍이 여러 레이어에서 발견될 수 있음)
  const seen = new Set<string>();
  const dedupedSuggestions = suggestions.filter((s) => {
    const key = edgeKey(s.source, s.target);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return { suggestions: dedupedSuggestions, staleWarnings };
}

// --- Layer 1: 네이밍 매칭 ---

function analyzeNaming(
  _rootDir: string,
  graph: KontextGraph,
  declaredEdges: Set<string>,
): LintSuggestion[] {
  const suggestions: LintSuggestion[] = [];

  // 컴포넌트 ID별로 파일을 그룹핑
  const idToFiles = new Map<string, string[]>();

  for (const node of graph.nodes) {
    const id = extractBaseId(node.id);
    if (!id) continue;
    const list = idToFiles.get(id) ?? [];
    list.push(node.id);
    idToFiles.set(id, list);
  }

  // 같은 ID를 가진 파일들 중 연결되지 않은 쌍 찾기
  for (const [id, files] of idToFiles) {
    if (files.length < 2) continue;

    for (let i = 0; i < files.length; i++) {
      for (let j = i + 1; j < files.length; j++) {
        const a = files[i]!;
        const b = files[j]!;

        // 같은 패키지 내 파일은 무시
        if (getPackageDir(a) === getPackageDir(b)) continue;

        if (!declaredEdges.has(edgeKey(a, b)) && !declaredEdges.has(edgeKey(b, a))) {
          suggestions.push({
            source: a,
            target: b,
            layer: "naming",
            confidence: 0.8,
            detail: `Same component ID "${id}" across packages`,
          });
        }
      }
    }
  }

  return suggestions;
}

// --- Layer 2: Import 분석 ---

const IMPORT_REGEX = /(?:import|from)\s+['"](@seed-design\/[^'"]+|\.\.?\/[^'"]+)['"]/g;

function analyzeImports(
  rootDir: string,
  graph: KontextGraph,
  _declaredEdges: Set<string>,
): LintSuggestion[] {
  const suggestions: LintSuggestion[] = [];

  for (const node of graph.nodes) {
    if (!node.id.endsWith(".ts") && !node.id.endsWith(".tsx")) continue;

    const absPath = resolve(rootDir, node.id);
    let content: string;
    try {
      content = readFileSync(absPath, "utf-8");
    } catch {
      continue;
    }

    const sourcePackage = getPackageDir(node.id);

    for (const match of content.matchAll(IMPORT_REGEX)) {
      const importPath = match[1]!;

      // @seed-design/ 패키지 import만 분석
      if (!importPath.startsWith("@seed-design/")) continue;

      // import 패키지를 실제 디렉토리로 매핑
      const targetPackage = resolveImportToPackage(importPath);
      if (!targetPackage || targetPackage === sourcePackage) continue;

      // 이 패키지 간 관계가 선언되어 있는지 확인
      const hasRelation = graph.edges.some(
        (e) =>
          (e.source.startsWith(sourcePackage) && e.target.startsWith(targetPackage)) ||
          (e.source.startsWith(targetPackage) && e.target.startsWith(sourcePackage)),
      );

      if (!hasRelation) {
        suggestions.push({
          source: node.id,
          target: targetPackage,
          layer: "import",
          confidence: 0.9,
          detail: `Imports from ${importPath}`,
        });
      }
    }
  }

  return suggestions;
}

// --- Layer 3: Git co-change ---

function analyzeCoChange(
  rootDir: string,
  graph: KontextGraph,
  declaredEdges: Set<string>,
  commitCount: number,
  jaccardThreshold: number,
  minCoOccurrences: number,
  ignorePatterns: string[],
): { coChangeSuggestions: LintSuggestion[]; staleWarnings: LintStaleWarning[] } {
  const coChangeSuggestions: LintSuggestion[] = [];
  const staleWarnings: LintStaleWarning[] = [];

  // git log 파싱
  let gitOutput: string;
  try {
    gitOutput = execSync(`git log --name-only --pretty=format:"COMMIT:%H" -n ${commitCount}`, {
      cwd: rootDir,
      encoding: "utf-8",
      maxBuffer: 50 * 1024 * 1024,
    });
  } catch {
    return { coChangeSuggestions, staleWarnings };
  }

  // 커밋별 파일 목록 구축
  const commits: string[][] = [];
  let currentFiles: string[] = [];

  for (const line of gitOutput.split("\n")) {
    if (line.startsWith("COMMIT:")) {
      if (currentFiles.length > 0) commits.push(currentFiles);
      currentFiles = [];
    } else if (line.trim()) {
      const file = line.trim();
      const shouldIgnore = ignorePatterns.some((p) => minimatch(file, p));
      if (!shouldIgnore) currentFiles.push(file);
    }
  }
  if (currentFiles.length > 0) commits.push(currentFiles);

  // 파일별 커밋 인덱스 + 파일 쌍 co-occurrence 집계
  const fileCommits = new Map<string, Set<number>>();
  const pairCount = new Map<string, number>();

  for (let ci = 0; ci < commits.length; ci++) {
    const files = commits[ci]!;
    for (const f of files) {
      const set = fileCommits.get(f) ?? new Set();
      set.add(ci);
      fileCommits.set(f, set);
    }

    // 커밋 내 파일 쌍 (최대 50파일까지만 — 큰 커밋은 노이즈)
    if (files.length > 50) continue;
    for (let i = 0; i < files.length; i++) {
      for (let j = i + 1; j < files.length; j++) {
        // 같은 패키지 내 파일은 무시
        if (getPackageDir(files[i]!) === getPackageDir(files[j]!)) continue;

        const key = edgeKey(files[i]!, files[j]!);
        pairCount.set(key, (pairCount.get(key) ?? 0) + 1);
      }
    }
  }

  // Jaccard 계산 + 미선언 관계 발견
  for (const [key, count] of pairCount) {
    if (count < minCoOccurrences) continue;

    const [a, b] = key.split("|||") as [string, string];
    const commitsA = fileCommits.get(a);
    const commitsB = fileCommits.get(b);
    if (!commitsA || !commitsB) continue;

    const intersection = new Set([...commitsA].filter((x) => commitsB.has(x)));
    const union = new Set([...commitsA, ...commitsB]);
    const jaccard = intersection.size / union.size;

    if (jaccard < jaccardThreshold) continue;

    if (!declaredEdges.has(edgeKey(a, b)) && !declaredEdges.has(edgeKey(b, a))) {
      coChangeSuggestions.push({
        source: a,
        target: b,
        layer: "co-change",
        confidence: jaccard,
        detail: `${count} co-changes, Jaccard: ${jaccard.toFixed(2)}`,
      });
    }
  }

  // Stale 관계 감지: 선언됐지만 co-change 0회
  for (const edge of graph.edges) {
    const key1 = edgeKey(edge.source, edge.target);
    const key2 = edgeKey(edge.target, edge.source);
    const count = (pairCount.get(key1) ?? 0) + (pairCount.get(key2) ?? 0);

    if (count === 0 && !edge.generated) {
      staleWarnings.push({
        source: edge.source,
        target: edge.target,
        reason: `No co-changes in last ${commitCount} commits`,
      });
    }
  }

  return { coChangeSuggestions, staleWarnings };
}

// --- 유틸리티 ---

function edgeKey(a: string, b: string): string {
  return a < b ? `${a}|||${b}` : `${b}|||${a}`;
}

function extractBaseId(filePath: string): string | null {
  const name = basename(filePath).replace(/\.[^.]+$/, "");
  if (!name || name === "index") return null;

  // PascalCase → kebab-case
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function getPackageDir(filePath: string): string {
  const parts = filePath.split("/");
  if (parts[0] === "packages" || parts[0] === "ecosystem" || parts[0] === "tools") {
    return parts.slice(0, 2).join("/");
  }
  if (parts[0] === "docs") return "docs";
  return parts[0] ?? "";
}

function resolveImportToPackage(importPath: string): string | null {
  // "@seed-design/css/recipes/button" → "packages/css"
  // "@seed-design/react-checkbox" → "packages/react-headless/checkbox"
  const withoutScope = importPath.replace("@seed-design/", "");
  const parts = withoutScope.split("/");
  const pkgName = parts[0]!;

  // 패키지 이름 → 디렉토리 매핑 (간단한 규칙)
  if (pkgName === "css") return "packages/css";
  if (pkgName === "react") return "packages/react";
  if (pkgName.startsWith("react-"))
    return `packages/react-headless/${pkgName.replace("react-", "")}`;
  if (pkgName === "rootage") return "packages/rootage";
  if (pkgName === "qvism-preset") return "packages/qvism-preset";

  return `packages/${pkgName}`;
}
