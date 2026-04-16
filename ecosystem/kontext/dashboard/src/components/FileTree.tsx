import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, File, Folder, Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { HighlightInfo, HighlightType } from "@/hooks/useHighlightedPaths";
import type { FileEntry } from "@/types";

const HIGHLIGHT_COLORS: Record<
  HighlightType,
  { bg: string; dot: string; icon: string; label: string }
> = {
  when: {
    bg: "bg-[oklch(0.15_0.04_250)]",
    dot: "bg-[oklch(0.60_0.18_250)]",
    icon: "text-[oklch(0.60_0.18_250)]",
    label: "Source",
  },
  exists: {
    bg: "bg-[oklch(0.14_0.04_155)]",
    dot: "bg-[oklch(0.60_0.18_155)]",
    icon: "text-[oklch(0.60_0.18_155)]",
    label: "Affected",
  },
  missing: {
    bg: "bg-[oklch(0.14_0.04_25)]",
    dot: "bg-[oklch(0.55_0.20_25)]",
    icon: "text-[oklch(0.55_0.20_25)]",
    label: "Missing",
  },
  optional: {
    bg: "bg-[oklch(0.14_0.04_85)]",
    dot: "bg-[oklch(0.70_0.15_85)]",
    icon: "text-[oklch(0.70_0.15_85)]",
    label: "Optional",
  },
  folder: {
    bg: "bg-[oklch(0.13_0.02_250)]",
    dot: "bg-[oklch(0.50_0.08_250)]",
    icon: "text-[oklch(0.50_0.08_250)]",
    label: "Contains affected files",
  },
};

interface FileTreeProps {
  loadDir: (dir: string) => Promise<void>;
  getEntries: (dir: string) => FileEntry[] | undefined;
  isLoading: (dir: string) => boolean;
  onDragFile?: (path: string) => void;
  onKontextClick?: (packageDir: string) => void;
  /** Currently selected file path */
  selectedPath?: string | null;
  /** Paths to highlight with status-based colors */
  highlightedPaths?: Map<string, HighlightInfo>;
  /** Callback when any file/folder is selected */
  onFileSelect?: (path: string) => void;
  /** Path to scroll into view and flash */
  scrollToPath?: string | null;
  /** Currently selected kontext.yaml package dir (shown as accent in Files tab) */
  activeKontextDir?: string | null;
}

export function FileTree({
  loadDir,
  getEntries,
  isLoading,
  onDragFile,
  onKontextClick,
  selectedPath,
  highlightedPaths,
  onFileSelect,
  scrollToPath,
  activeKontextDir,
}: FileTreeProps) {
  useEffect(() => {
    loadDir("");
  }, [loadDir]);

  const rootEntries = getEntries("") ?? [];
  const rootLoading = isLoading("");

  return (
    <div className="h-full overflow-auto text-[12px]">
      <div className="px-1 pb-4 pt-1">
        {rootLoading ? (
          <div className="px-3 py-2 text-muted-foreground/50">Loading...</div>
        ) : (
          rootEntries.map((entry) => (
            <TreeNode
              key={entry.path}
              entry={entry}
              depth={0}
              loadDir={loadDir}
              getEntries={getEntries}
              isLoading={isLoading}
              onDragFile={onDragFile}
              onKontextClick={onKontextClick}
              selectedPath={selectedPath}
              highlightedPaths={highlightedPaths}
              onFileSelect={onFileSelect}
              scrollToPath={scrollToPath}
              activeKontextDir={activeKontextDir}
            />
          ))
        )}
      </div>
    </div>
  );
}

function TreeNode({
  entry,
  depth,
  loadDir,
  getEntries,
  isLoading: isLoadingFn,
  onDragFile,
  onKontextClick,
  selectedPath,
  highlightedPaths,
  onFileSelect,
  scrollToPath,
  activeKontextDir,
}: {
  entry: FileEntry;
  depth: number;
  loadDir: (dir: string) => Promise<void>;
  getEntries: (dir: string) => FileEntry[] | undefined;
  isLoading: (dir: string) => boolean;
  onDragFile?: (path: string) => void;
  onKontextClick?: (packageDir: string) => void;
  selectedPath?: string | null;
  highlightedPaths?: Map<string, HighlightInfo>;
  onFileSelect?: (path: string) => void;
  scrollToPath?: string | null;
  activeKontextDir?: string | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const isDir = entry.type === "directory";
  const children = isDir ? getEntries(entry.path) : undefined;
  const loading = isDir ? isLoadingFn(entry.path) : false;
  const isKontext = entry.name === "kontext.yaml";
  const isActiveKontext =
    isKontext && activeKontextDir && entry.path === `${activeKontextDir}/kontext.yaml`;
  const isSelected = selectedPath === entry.path;
  const highlightInfo = highlightedPaths?.get(entry.path);
  const isHighlighted = !!highlightInfo;
  const colors = highlightInfo ? HIGHLIGHT_COLORS[highlightInfo.type] : null;

  // Auto-expand folders that contain highlighted children or the active kontext
  useEffect(() => {
    if (!isDir || expanded) return;
    const kontextPath = activeKontextDir ? `${activeKontextDir}/kontext.yaml` : null;
    const shouldExpand =
      (kontextPath && kontextPath.startsWith(entry.path + "/")) ||
      (highlightedPaths &&
        Array.from(highlightedPaths.keys()).some((p) => p.startsWith(entry.path + "/")));
    if (shouldExpand) {
      loadDir(entry.path).then(() => setExpanded(true));
    }
  }, [highlightedPaths, activeKontextDir, isDir, expanded, entry.path, loadDir]);

  // Scroll active kontext.yaml into view
  useEffect(() => {
    if (isActiveKontext && btnRef.current) {
      btnRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isActiveKontext]);

  // Scroll into view when scrollToPath matches
  useEffect(() => {
    if (scrollToPath === entry.path && btnRef.current) {
      btnRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      btnRef.current.classList.add("animate-flash");
      const timer = setTimeout(() => btnRef.current?.classList.remove("animate-flash"), 1000);
      return () => clearTimeout(timer);
    }
  }, [scrollToPath, entry.path]);

  // Check if any child is kontext.yaml (after loaded)
  const hasKontextChild = children?.some((c) => c.name === "kontext.yaml");

  async function handleClick() {
    // Notify file selection
    onFileSelect?.(entry.path);

    if (isKontext && onKontextClick) {
      const parts = entry.path.split("/");
      parts.pop();
      onKontextClick(parts.join("/"));
    }

    if (isDir) {
      if (!expanded && !children) {
        await loadDir(entry.path);
      }
      setExpanded(!expanded);
    }
  }

  function handleDragStart(e: React.DragEvent) {
    e.dataTransfer.setData("text/plain", entry.path);
    e.dataTransfer.effectAllowed = "copy";
    onDragFile?.(entry.path);
  }

  const btn = (
    <button
      ref={btnRef}
      type="button"
      onClick={handleClick}
      draggable
      onDragStart={handleDragStart}
      className={cn(
        "flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left cursor-pointer transition-all duration-100",
        "hover:bg-[oklch(0.20_0.01_260)] active:bg-[oklch(0.24_0.01_260)]",
        isKontext && "text-primary hover:bg-[oklch(0.20_0.04_250)]",
        isActiveKontext && "bg-[oklch(0.16_0.05_250)] animate-kontext-glow",
        hasKontextChild && "text-foreground/90",
        isSelected && "bg-sidebar-accent text-sidebar-accent-foreground",
        isHighlighted && !isSelected && colors?.bg,
      )}
      style={{ paddingLeft: `${depth * 16 + 8}px` }}
    >
      {isDir ? (
        expanded ? (
          <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground/70" />
        ) : (
          <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/70" />
        )
      ) : (
        <span className="w-3" />
      )}
      {isDir ? (
        <Folder
          className={cn(
            "h-3.5 w-3.5 shrink-0",
            isHighlighted
              ? colors?.icon
              : hasKontextChild
                ? "text-primary/60"
                : "text-muted-foreground/50",
          )}
        />
      ) : isKontext ? (
        <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" />
      ) : (
        <File
          className={cn(
            "h-3.5 w-3.5 shrink-0",
            isHighlighted ? colors?.icon : "text-muted-foreground/30",
          )}
        />
      )}
      <span className={cn("min-w-0 flex-1 truncate font-mono", isKontext && "font-medium")}>
        {entry.name}
      </span>
      {isHighlighted && !isSelected && (
        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", colors?.dot)} />
      )}
    </button>
  );

  return (
    <div>
      {isHighlighted && highlightInfo ? (
        <Tooltip>
          <TooltipTrigger asChild>{btn}</TooltipTrigger>
          <TooltipContent
            side="right"
            className="max-w-[300px] space-y-2 p-3 text-[11px] bg-[oklch(0.97_0.005_260)] border-[oklch(0.85_0.01_260)] shadow-lg"
          >
            {/* Status label */}
            <div className="flex items-center gap-1.5">
              <span className={cn("h-2 w-2 rounded-full shrink-0", colors?.dot)} />
              <span className="font-medium text-[oklch(0.15_0.02_260)]">
                {highlightInfo.type === "when" && "Source file"}
                {highlightInfo.type === "exists" && "Affected file"}
                {highlightInfo.type === "missing" && "File not found on disk"}
                {highlightInfo.type === "optional" && "Optional dependency"}
                {highlightInfo.type === "folder" && "Contains affected files"}
              </span>
            </div>

            {/* Explanation */}
            <div className="text-[oklch(0.35_0.01_260)] leading-snug">
              {highlightInfo.type === "when" &&
                "Changes to this file may require updates to related files."}
              {highlightInfo.type === "exists" &&
                "This file should be updated when the source changes."}
              {highlightInfo.type === "missing" &&
                "Referenced in kontext.yaml but doesn't exist on disk yet."}
              {highlightInfo.type === "optional" &&
                "May need updating depending on the nature of the change."}
              {highlightInfo.type === "folder" &&
                "Files inside this folder are part of a kontext relationship."}
            </div>

            {/* Sources — show all when patterns */}
            {highlightInfo.sources.length > 0 && (
              <div className="space-y-1.5 pt-1.5 border-t border-[oklch(0.88_0.005_260)]">
                {highlightInfo.sources.map((src, i) => (
                  <div key={i} className="space-y-0.5">
                    <div className="font-mono text-[10px] text-[oklch(0.45_0.01_260)]">
                      when:{" "}
                      <span className="text-[oklch(0.25_0.02_260)] font-medium">{src.when}</span>
                    </div>
                    {src.reason && (
                      <div className="text-[oklch(0.40_0.01_260)] pl-2">{src.reason}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TooltipContent>
        </Tooltip>
      ) : (
        btn
      )}

      {expanded && isDir && (
        <div>
          {loading ? (
            <div
              className="px-2 py-1 text-muted-foreground/40"
              style={{ paddingLeft: `${(depth + 1) * 16 + 8}px` }}
            >
              ...
            </div>
          ) : (
            children?.map((child) => (
              <TreeNode
                key={child.path}
                entry={child}
                depth={depth + 1}
                loadDir={loadDir}
                getEntries={getEntries}
                isLoading={isLoadingFn}
                onDragFile={onDragFile}
                onKontextClick={onKontextClick}
                selectedPath={selectedPath}
                highlightedPaths={highlightedPaths}
                onFileSelect={onFileSelect}
                scrollToPath={scrollToPath}
                activeKontextDir={activeKontextDir}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
