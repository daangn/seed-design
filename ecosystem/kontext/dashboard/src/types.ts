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
}

export interface KontextGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  packages: string[];
  builtAt: string;
}

export type ViewMode = "graph" | "matrix";
