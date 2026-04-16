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

export interface FileEntry {
  name: string;
  type: "file" | "directory";
  path: string;
}

export interface KontextConfig {
  content: string;
  exists: boolean;
}

/** Search result combining forward and reverse lookups */
export interface SearchResult {
  file: string;
  direction: "affects" | "affected-by";
  relatedFile: string;
  reason?: string;
  packageDir: string;
}
