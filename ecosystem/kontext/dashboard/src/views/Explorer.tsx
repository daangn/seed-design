import { useCallback, useMemo, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileTree } from "@/components/FileTree";
import { DependencyTree } from "@/components/DependencyTree";
import { ConnectionLines } from "@/components/ConnectionLines";
import { ResizeHandle } from "@/components/ResizeHandle";
import { useFileTree } from "@/hooks/useFileTree";
import type { DependencyTreeHandle } from "@/components/DependencyTree";
import type { GraphEdge, KontextGraph } from "@/types";

interface ExplorerProps {
  graph: KontextGraph;
}

interface DependencyInfo {
  forward: GraphEdge[];
  reverse: GraphEdge[];
}

export function Explorer({ graph }: ExplorerProps) {
  const fileTree = useFileTree();
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [treePanelWidth, setTreePanelWidth] = useState(300);

  // Refs for connection lines
  const selectedElRef = useRef<HTMLElement | null>(null);
  const depTreeRef = useRef<DependencyTreeHandle>(null);
  const rightContainerRef = useRef<HTMLDivElement>(null);

  // Find kontext relationships for the selected file
  const deps = useMemo((): DependencyInfo | null => {
    if (!selectedPath) return null;

    const forward = graph.edges.filter((e) => e.source === selectedPath);
    const reverse = graph.edges.filter((e) => e.target === selectedPath);

    // Check folder prefix match
    if (forward.length === 0 && reverse.length === 0) {
      const prefix = selectedPath + "/";
      const forwardByPrefix = graph.edges.filter((e) => e.source.startsWith(prefix));
      const reverseByPrefix = graph.edges.filter((e) => e.target.startsWith(prefix));
      if (forwardByPrefix.length > 0 || reverseByPrefix.length > 0) {
        return { forward: forwardByPrefix, reverse: reverseByPrefix };
      }
    }

    if (forward.length === 0 && reverse.length === 0) return null;
    return { forward, reverse };
  }, [graph, selectedPath]);

  // Track the selected file's DOM element for connection lines
  const handleFileSelect = useCallback((path: string) => {
    setSelectedPath(path);
    // Find the selected button element in the left tree after next render
    requestAnimationFrame(() => {
      const leftPane = document.querySelector("[data-explorer-left]");
      if (!leftPane) return;
      const buttons = leftPane.querySelectorAll("button");
      for (const btn of buttons) {
        if (btn.classList.contains("bg-sidebar-accent")) {
          selectedElRef.current = btn;
          return;
        }
      }
    });
  }, []);

  // Highlighted paths for left tree
  const highlightedPaths = useMemo(() => {
    const paths = new Set<string>();
    if (!deps) return paths;
    for (const edge of deps.forward) addPathAndParents(paths, edge.target);
    for (const edge of deps.reverse) addPathAndParents(paths, edge.source);
    return paths;
  }, [deps]);

  // Get target element callback for ConnectionLines
  const getTargetEl = useCallback(
    (idx: number) => depTreeRef.current?.getRefForEdge(idx) ?? null,
    [],
  );

  return (
    <div className="flex h-full">
      {/* Left: Full file tree */}
      <div
        data-explorer-left
        className="shrink-0 border-r border-border bg-sidebar-background flex flex-col"
        style={{ width: `${treePanelWidth}px` }}
      >
        <div className="px-3 pt-3 pb-1">
          <h3 className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground/70">
            Source
          </h3>
        </div>
        <ScrollArea className="flex-1">
          <FileTree
            loadDir={fileTree.loadDir}
            getEntries={fileTree.getEntries}
            isLoading={fileTree.isLoading}
            selectedPath={selectedPath}
            highlightedPaths={highlightedPaths}
            onFileSelect={handleFileSelect}
          />
        </ScrollArea>
      </div>

      {/* Resize handle */}
      <ResizeHandle
        direction="right"
        onResize={(delta) => setTreePanelWidth((w) => Math.max(200, Math.min(500, w + delta)))}
      />

      {/* Right: Dependency tree + SVG overlay */}
      <div ref={rightContainerRef} className="flex-1 min-w-0 relative">
        {/* Connection lines SVG overlay */}
        {selectedPath && deps && deps.forward.length > 0 && (
          <ConnectionLines
            sourceEl={selectedElRef.current}
            getTargetEl={getTargetEl}
            containerEl={rightContainerRef.current}
            forwardEdges={deps.forward}
            nodes={graph.nodes}
            measureKey={selectedPath}
          />
        )}

        {/* Dependency mini tree */}
        {selectedPath && deps ? (
          <ScrollArea className="h-full">
            <div className="px-2 pt-3 pb-1">
              <h3 className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground/70 px-2">
                Dependencies
              </h3>
            </div>
            <DependencyTree
              ref={depTreeRef}
              forwardEdges={deps.forward}
              reverseEdges={deps.reverse}
              nodes={graph.nodes}
              direction="forward"
            />
          </ScrollArea>
        ) : selectedPath ? (
          <EmptyRelation path={selectedPath} />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

// --- Empty states ---

function EmptyRelation({ path }: { path: string }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="max-w-xs text-center space-y-2">
        <p className="font-mono text-[11px] text-muted-foreground/30 truncate px-4">{path}</p>
        <p className="text-[11px] text-muted-foreground/25">No kontext relationships.</p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="max-w-xs text-center space-y-3">
        <Sparkles className="h-5 w-5 mx-auto text-primary/15" />
        <p className="text-[11px] text-muted-foreground/35">
          Select a file to see its kontext dependencies.
        </p>
      </div>
    </div>
  );
}

// --- Helpers ---

function addPathAndParents(set: Set<string>, path: string) {
  set.add(path);
  const parts = path.split("/");
  for (let i = 1; i < parts.length; i++) {
    set.add(parts.slice(0, i).join("/"));
  }
}
