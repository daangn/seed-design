import { useMemo } from "react";
import type { KontextGraph } from "@/types";

export type HighlightType = "when" | "exists" | "missing" | "optional" | "folder";

/** A single source that causes this file to be highlighted */
export interface HighlightSource {
  when: string;
  reason?: string;
}

export interface HighlightInfo {
  type: HighlightType;
  /** All when patterns that reference this file (supports multiple) */
  sources: HighlightSource[];
  /** Which kontext.yaml defines this relationship */
  definedBy?: string;
}

interface EditableRelation {
  when: string;
  affects: { path: string; reason?: string; optional: boolean }[];
}

/**
 * Builds a Map of file paths → highlight info from the current relations.
 * Supports multiple when patterns referencing the same file.
 */
export function useHighlightedPaths(
  relations: EditableRelation[],
  graph: KontextGraph,
  selectedPackage?: string | null,
): Map<string, HighlightInfo> {
  return useMemo(() => {
    const map = new Map<string, HighlightInfo>();
    if (relations.length === 0) return map;

    const nodeExistsSet = new Set(graph.nodes.filter((n) => n.exists).map((n) => n.id));
    const definedBy = selectedPackage ? `${selectedPackage}/kontext.yaml` : undefined;

    for (const rel of relations) {
      if (!rel.when) continue;

      // when paths — source files
      addOrMerge(map, rel.when, {
        type: "when",
        sources: [{ when: rel.when, reason: "Source pattern" }],
        definedBy,
      });

      // affects paths
      for (const aff of rel.affects) {
        if (!aff.path) continue;
        const type: HighlightType = aff.optional
          ? "optional"
          : nodeExistsSet.has(aff.path)
            ? "exists"
            : "missing";
        addOrMerge(map, aff.path, {
          type,
          sources: [{ when: rel.when, reason: aff.reason }],
          definedBy,
        });
      }
    }

    // Add parent folders
    const folderPaths = new Set<string>();
    for (const path of map.keys()) {
      const parts = path.split("/");
      for (let i = 1; i < parts.length; i++) {
        folderPaths.add(parts.slice(0, i).join("/"));
      }
    }
    for (const folder of folderPaths) {
      if (!map.has(folder)) {
        map.set(folder, { type: "folder", sources: [], definedBy });
      }
    }

    return map;
  }, [relations, graph, selectedPackage]);
}

function addOrMerge(map: Map<string, HighlightInfo>, path: string, info: HighlightInfo) {
  const existing = map.get(path);
  if (existing) {
    // Merge sources — add new when patterns that aren't already tracked
    for (const src of info.sources) {
      if (!existing.sources.some((s) => s.when === src.when)) {
        existing.sources.push(src);
      }
    }
  } else {
    map.set(path, { ...info, sources: [...info.sources] });
  }
}
