import type { TokenRef } from "../parser/ast";
import type { DependencyGraph } from "./types";

export function findDependencyCycle(
  graph: DependencyGraph,
): { mode: string; path: TokenRef[] } | undefined {
  const settledByMode = new Map<string, Set<TokenRef>>();

  for (const node of Object.values(graph)) {
    for (const mode of Object.keys(node.dependencies)) {
      const settled = settledByMode.get(mode) ?? new Set<TokenRef>();
      settledByMode.set(mode, settled);

      const path = new Set<TokenRef>();
      let current: TokenRef | undefined = node.name;

      while (current && !settled.has(current)) {
        if (path.has(current)) {
          const tokens = [...path];
          return { mode, path: [...tokens.slice(tokens.indexOf(current)), current] };
        }

        path.add(current);
        current = graph[current]?.dependencies[mode];
      }

      for (const token of path) settled.add(token);
    }
  }

  return undefined;
}
