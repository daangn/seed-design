import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { Check, X, Minus, Zap, Folder, File, ArrowLeft } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { GraphEdge, GraphNode } from "@/types";

// --- Types ---

interface MiniTreeNode {
  /** Display label — may be a compact path like "docs/content/react" */
  label: string;
  /** Full path of this segment */
  fullPath: string;
  /** Whether this is a leaf (actual file from an edge) */
  isLeaf: boolean;
  /** Edge data if leaf */
  edge?: GraphEdge;
  /** Original index of this edge in the edges array */
  edgeIdx?: number;
  /** Node data if leaf (for exists check) */
  node?: GraphNode;
  /** Children folders/files */
  children: MiniTreeNode[];
}

export interface DependencyTreeHandle {
  getRefForEdge: (idx: number) => HTMLElement | null;
}

interface DependencyTreeProps {
  forwardEdges: GraphEdge[];
  reverseEdges: GraphEdge[];
  nodes: GraphNode[];
  direction: "forward" | "reverse";
  className?: string;
}

// --- Build mini tree from edges ---

function buildMiniTree(
  edges: GraphEdge[],
  nodes: GraphNode[],
  direction: "forward" | "reverse",
): MiniTreeNode[] {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  // Group files by their directory path
  interface LeafInfo {
    fileName: string;
    fullPath: string;
    edge: GraphEdge;
    edgeIdx: number;
    node?: GraphNode;
  }

  const dirMap = new Map<string, LeafInfo[]>();

  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];
    const path = direction === "forward" ? edge.target : edge.source;
    const lastSlash = path.lastIndexOf("/");
    const dir = lastSlash >= 0 ? path.slice(0, lastSlash) : "";
    const fileName = lastSlash >= 0 ? path.slice(lastSlash + 1) : path;

    if (!dirMap.has(dir)) dirMap.set(dir, []);
    dirMap.get(dir)!.push({
      fileName,
      fullPath: path,
      edge,
      edgeIdx: i,
      node: nodeMap.get(path),
    });
  }

  // Build tree structure from directory paths
  const root: MiniTreeNode[] = [];

  for (const [dir, leaves] of dirMap) {
    // Find or create the directory node chain
    let parent = root;
    if (dir) {
      const parts = dir.split("/");
      let currentPath = "";
      for (const part of parts) {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        let existing = parent.find((n) => !n.isLeaf && n.fullPath === currentPath);
        if (!existing) {
          existing = {
            label: part,
            fullPath: currentPath,
            isLeaf: false,
            children: [],
          };
          parent.push(existing);
        }
        parent = existing.children;
      }
    }

    // Add leaf files
    for (const leaf of leaves) {
      parent.push({
        label: leaf.fileName,
        fullPath: leaf.fullPath,
        isLeaf: true,
        edge: leaf.edge,
        edgeIdx: leaf.edgeIdx,
        node: leaf.node,
        children: [],
      });
    }
  }

  // Compact single-child folder chains
  compactTree(root);

  return root;
}

function compactTree(nodes: MiniTreeNode[]) {
  for (const node of nodes) {
    // If this folder has exactly one child that is also a folder, merge them
    while (!node.isLeaf && node.children.length === 1 && !node.children[0].isLeaf) {
      const child = node.children[0];
      node.label = `${node.label}/${child.label}`;
      node.fullPath = child.fullPath;
      node.children = child.children;
    }
    // Recurse
    if (node.children.length > 0) {
      compactTree(node.children);
    }
  }
}

// --- Component ---

export const DependencyTree = forwardRef<DependencyTreeHandle, DependencyTreeProps>(
  function DependencyTree({ forwardEdges, reverseEdges, nodes, className }, ref) {
    const refMap = useRef<Map<number, HTMLElement>>(new Map());

    useImperativeHandle(ref, () => ({
      getRefForEdge: (idx: number) => refMap.current.get(idx) ?? null,
    }));

    const setLeafRef = useCallback((idx: number, el: HTMLElement | null) => {
      if (el) refMap.current.set(idx, el);
      else refMap.current.delete(idx);
    }, []);

    const forwardTree = buildMiniTree(forwardEdges, nodes, "forward");
    const reverseTree = buildMiniTree(reverseEdges, nodes, "reverse");

    const hasForward = forwardEdges.length > 0;
    const hasReverse = reverseEdges.length > 0;

    if (!hasForward && !hasReverse) return null;

    return (
      <div className={cn("py-4 px-4 space-y-5", className)}>
        {/* Forward: affects */}
        {hasForward && (
          <div className="space-y-2">
            <h3 className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground/70 px-1">
              Affects · {forwardEdges.length}
            </h3>
            <div className="space-y-0.5">
              {forwardTree.map((node) => (
                <MiniTreeRow
                  key={node.fullPath}
                  node={node}
                  depth={0}
                  edges={forwardEdges}
                  direction="forward"
                  setLeafRef={setLeafRef}
                />
              ))}
            </div>
          </div>
        )}

        {hasForward && hasReverse && <div className="dither-divider" />}

        {/* Reverse: affected by */}
        {hasReverse && (
          <div className="space-y-2">
            <h3 className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground/70 px-1">
              Affected by · {reverseEdges.length}
            </h3>
            <div className="space-y-0.5">
              {reverseTree.map((node) => (
                <MiniTreeRow
                  key={node.fullPath}
                  node={node}
                  depth={0}
                  edges={reverseEdges}
                  direction="reverse"
                  setLeafRef={setLeafRef}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
);

// --- Tree Row ---

function MiniTreeRow({
  node,
  depth,
  edges,
  direction,
  setLeafRef,
}: {
  node: MiniTreeNode;
  depth: number;
  edges: GraphEdge[];
  direction: "forward" | "reverse";
  setLeafRef: (idx: number, el: HTMLElement | null) => void;
}) {
  if (node.isLeaf) {
    const edge = node.edge!;
    const edgeIdx = node.edgeIdx ?? 0;
    const exists = node.node?.exists ?? false;

    return (
      <div
        ref={(el) => setLeafRef(edgeIdx, el)}
        data-edge-idx={edgeIdx}
        className="flex items-start gap-1.5 rounded px-2 py-1.5 animate-card-in transition-colors hover:bg-[oklch(0.14_0.01_260)]"
        style={{
          paddingLeft: `${depth * 14 + 8}px`,
          animationDelay: `${edgeIdx * 40}ms`,
        }}
      >
        {/* Status icon */}
        <span className="mt-px shrink-0">
          {direction === "reverse" ? (
            <ArrowLeft className="h-3 w-3 text-[oklch(0.65_0.18_340)]" />
          ) : exists ? (
            <Check className="h-3 w-3 text-[oklch(0.65_0.18_155)]" />
          ) : edge.optional ? (
            <Minus className="h-3 w-3 text-[oklch(0.75_0.15_85)]" />
          ) : (
            <X className="h-3 w-3 text-[oklch(0.55_0.2_25)]" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <File
              className={cn(
                "h-3 w-3 shrink-0",
                exists ? "text-muted-foreground/40" : "text-[oklch(0.55_0.2_25)]/50",
              )}
            />
            <code
              className={cn(
                "truncate font-mono text-[11px]",
                direction === "reverse"
                  ? "text-foreground/70"
                  : exists
                    ? "text-foreground/70"
                    : "text-[oklch(0.55_0.2_25)]",
              )}
            >
              {node.label}
            </code>
            {edge.generated && (
              <Tooltip>
                <TooltipTrigger>
                  <Zap className="h-2.5 w-2.5 text-primary/40" />
                </TooltipTrigger>
                <TooltipContent className="font-mono text-xs">
                  {edge.command ?? "auto-generated"}
                </TooltipContent>
              </Tooltip>
            )}
            {edge.optional && <span className="text-[9px] text-muted-foreground/40">opt</span>}
          </div>
          {edge.reason && (
            <p className="mt-0.5 text-[9px] text-muted-foreground/40 leading-snug pl-4">
              {edge.reason}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Folder node
  return (
    <div>
      <div
        className="flex items-center gap-1.5 px-2 py-1 text-muted-foreground/50"
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
      >
        <Folder className="h-3 w-3 shrink-0 text-muted-foreground/30" />
        <span className="font-mono text-[10px] truncate">{node.label}</span>
      </div>
      {node.children.map((child) => (
        <MiniTreeRow
          key={child.fullPath}
          node={child}
          depth={depth + 1}
          edges={edges}
          direction={direction}
          setLeafRef={setLeafRef}
        />
      ))}
    </div>
  );
}
