import type { CheckResult, DepResult, KontextGraph } from "./types.js";

/**
 * 특정 파일과 관련된 모든 영향받는 파일을 반환
 */
export function findDeps(graph: KontextGraph, filePath: string): DepResult[] {
  const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]));
  const results: DepResult[] = [];

  for (const edge of graph.edges) {
    if (edge.source === filePath) {
      const node = nodeMap.get(edge.target);
      results.push({
        path: edge.target,
        reason: edge.reason,
        generated: edge.generated,
        command: edge.command,
        exists: node?.exists ?? false,
      });
    }
  }

  return results;
}

/**
 * 특정 파일이 영향을 주는 쪽인지 찾기 (역방향 조회)
 */
export function findAffectedBy(graph: KontextGraph, filePath: string): DepResult[] {
  const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]));
  const results: DepResult[] = [];

  for (const edge of graph.edges) {
    if (edge.target === filePath) {
      const node = nodeMap.get(edge.source);
      results.push({
        path: edge.source,
        reason: edge.reason,
        generated: edge.generated,
        command: edge.command,
        exists: node?.exists ?? false,
      });
    }
  }

  return results;
}

/**
 * 모든 소스 파일에 대해 affects 경로의 존재 여부를 검증
 */
export function checkCompleteness(graph: KontextGraph): CheckResult[] {
  // source별로 그룹핑
  const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]));
  const groups = new Map<
    string,
    { definedBy: string; targets: Array<{ path: string; exists: boolean }> }
  >();

  for (const edge of graph.edges) {
    if (edge.optional) continue;

    if (!groups.has(edge.source)) {
      groups.set(edge.source, { definedBy: edge.definedBy, targets: [] });
    }
    const node = nodeMap.get(edge.target);
    groups.get(edge.source)!.targets.push({
      path: edge.target,
      exists: node?.exists ?? false,
    });
  }

  const results: CheckResult[] = [];

  for (const [source, { definedBy, targets }] of groups) {
    const missing = targets.filter((t) => !t.exists).map((t) => t.path);
    results.push({
      source,
      definedBy,
      total: targets.length,
      existing: targets.length - missing.length,
      missing,
    });
  }

  return results;
}

/**
 * 변경된 파일 목록에서 영향받는 모든 파일을 반환
 */
export function analyzeImpact(
  graph: KontextGraph,
  changedFiles: string[],
): Map<string, DepResult[]> {
  const impact = new Map<string, DepResult[]>();

  for (const file of changedFiles) {
    const deps = findDeps(graph, file);
    if (deps.length > 0) {
      impact.set(file, deps);
    }
  }

  return impact;
}
