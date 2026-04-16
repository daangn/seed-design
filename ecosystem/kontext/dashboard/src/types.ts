export interface GraphNode {
  id: string;
  packageDir: string;
  exists: boolean;
}

export interface GraphEdge {
  source: string;
  target: string;
  reason?: string;
  generated: boolean;
  command?: string;
  optional: boolean;
  definedBy: string;
}

export interface KontextGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  packages: string[];
  builtAt: string;
}

export type ViewMode = "explorer" | "editor";

export interface FileEntry {
  name: string;
  type: "file" | "directory";
  path: string;
}

export interface KontextConfig {
  content: string;
  exists: boolean;
}

/** Grouped relation for display: one `when` pattern with its affected files */
export interface RelationGroup {
  when: string;
  definedBy: string;
  affects: AffectedFile[];
}

export interface AffectedFile {
  path: string;
  exists: boolean;
  reason?: string;
  generated: boolean;
  command?: string;
  optional: boolean;
}

/** Package summary for sidebar */
export interface PackageSummary {
  packageDir: string;
  hasKontext: boolean;
  relationCount: number;
  edgeCount: number;
}

/** Search result combining forward and reverse lookups */
export interface SearchResult {
  file: string;
  direction: "affects" | "affected-by";
  relatedFile: string;
  reason?: string;
  packageDir: string;
}
