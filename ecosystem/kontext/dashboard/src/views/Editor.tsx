import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Plus, Save, Trash2, GripVertical, Undo2, Redo2, Sparkles, FilePlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FileTree } from "@/components/FileTree";
import { ResizeHandle } from "@/components/ResizeHandle";
import { useFileTree } from "@/hooks/useFileTree";
import { useConfig } from "@/hooks/useConfig";
import { getPackageDotColor, getPackageLabel } from "@/lib/packages";
import { cn } from "@/lib/utils";
import type { KontextGraph } from "@/types";

interface EditorProps {
  graph: KontextGraph;
  onSaved: () => void;
}

interface EditableRelation {
  id: string;
  when: string;
  affects: EditableAffect[];
}

interface EditableAffect {
  id: string;
  path: string;
  reason: string;
  optional: boolean;
  generated: boolean;
  command: string;
}

interface EditorSnapshot {
  relations: EditableRelation[];
  ignorePatterns: string;
}

// --- Undo/Redo history hook ---
function useUndoRedo(maxSize = 50) {
  const undoStack = useRef<EditorSnapshot[]>([]);
  const redoStack = useRef<EditorSnapshot[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const syncState = useCallback(() => {
    setCanUndo(undoStack.current.length > 0);
    setCanRedo(redoStack.current.length > 0);
  }, []);

  const push = useCallback(
    (snapshot: EditorSnapshot) => {
      undoStack.current.push(JSON.parse(JSON.stringify(snapshot)));
      if (undoStack.current.length > maxSize) undoStack.current.shift();
      redoStack.current = []; // new edit clears redo
      syncState();
    },
    [maxSize, syncState],
  );

  const undo = useCallback(
    (current: EditorSnapshot): EditorSnapshot | null => {
      const prev = undoStack.current.pop() ?? null;
      if (prev) {
        redoStack.current.push(JSON.parse(JSON.stringify(current)));
      }
      syncState();
      return prev ? (JSON.parse(JSON.stringify(prev)) as EditorSnapshot) : null;
    },
    [syncState],
  );

  const redo = useCallback(
    (current: EditorSnapshot): EditorSnapshot | null => {
      const next = redoStack.current.pop() ?? null;
      if (next) {
        undoStack.current.push(JSON.parse(JSON.stringify(current)));
      }
      syncState();
      return next ? (JSON.parse(JSON.stringify(next)) as EditorSnapshot) : null;
    },
    [syncState],
  );

  const clear = useCallback(() => {
    undoStack.current = [];
    redoStack.current = [];
    syncState();
  }, [syncState]);

  return { push, undo, redo, clear, canUndo, canRedo };
}

export function Editor({ graph, onSaved }: EditorProps) {
  const fileTree = useFileTree();
  const { config, saving, loadConfig, saveConfig } = useConfig();
  const history = useUndoRedo();

  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [relations, setRelations] = useState<EditableRelation[]>([]);
  const [ignorePatterns, setIgnorePatterns] = useState("");
  const [yamlPanelWidth, setYamlPanelWidth] = useState(320);
  const [filePanelWidth, setFilePanelWidth] = useState(224);
  const [showNewPkgInput, setShowNewPkgInput] = useState(false);
  const [newPkgPath, setNewPkgPath] = useState("");

  // Packages with kontext.yaml (from graph edges)
  const kontextFiles = useMemo(() => {
    const files = new Set<string>();
    for (const edge of graph.edges) {
      files.add(edge.definedBy);
    }
    return Array.from(files).sort();
  }, [graph]);

  const packages = useMemo(() => {
    const pkgs = new Set(graph.packages);
    return Array.from(pkgs).sort();
  }, [graph]);

  // Load config when package is selected
  useEffect(() => {
    if (selectedPackage) {
      loadConfig(selectedPackage);
      history.clear();
    }
    // eslint-disable-next-line -- history.clear is stable but the object ref changes with canUndo/canRedo
  }, [selectedPackage, loadConfig]);

  // Parse YAML into editable state
  useEffect(() => {
    if (!config) return;
    if (!config.exists || !config.content) {
      setRelations([]);
      setIgnorePatterns("");
      return;
    }
    try {
      const parsed = parseYamlToRelations(config.content);
      setRelations(parsed.relations);
      setIgnorePatterns(parsed.ignore);
    } catch {
      setRelations([]);
      setIgnorePatterns("");
    }
  }, [config]);

  // Keep refs to current state for undo/redo keyboard handler
  const relationsRef = useRef(relations);
  const ignorePatternsRef = useRef(ignorePatterns);
  relationsRef.current = relations;
  ignorePatternsRef.current = ignorePatterns;

  // Cmd+Z undo / Cmd+Shift+Z redo — stable listener, no re-registration on state change
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        const current = {
          relations: relationsRef.current,
          ignorePatterns: ignorePatternsRef.current,
        };
        if (e.shiftKey) {
          const next = history.redo(current);
          if (next) {
            setRelations(next.relations);
            setIgnorePatterns(next.ignorePatterns);
            toast.info("Redo");
          }
        } else {
          const prev = history.undo(current);
          if (prev) {
            setRelations(prev.relations);
            setIgnorePatterns(prev.ignorePatterns);
            toast.info("Undo");
          }
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line -- refs are used for current values; history methods are stable
  }, []);

  // Snapshot current state for undo — call before structural changes
  function pushUndo() {
    history.push({ relations, ignorePatterns });
  }

  // Save undo snapshot on blur (for text edits) — avoids per-keystroke deep copies
  function onFieldBlur() {
    // We push AFTER blur so the current text is captured as the "before" for the next edit
    history.push({ relations, ignorePatterns });
  }

  // Generate YAML preview
  const yamlPreview = useMemo(
    () => generateYaml(relations, ignorePatterns),
    [relations, ignorePatterns],
  );

  function addRelation() {
    pushUndo();
    setRelations((prev) => [...prev, { id: crypto.randomUUID(), when: "", affects: [] }]);
  }

  function removeRelation(id: string) {
    pushUndo();
    setRelations((prev) => prev.filter((r) => r.id !== id));
  }

  // Text input updates — no pushUndo per keystroke
  function updateRelationWhen(id: string, when: string) {
    setRelations((prev) => prev.map((r) => (r.id === id ? { ...r, when } : r)));
  }

  function addAffect(relationId: string, path: string) {
    pushUndo();
    setRelations((prev) =>
      prev.map((r) =>
        r.id === relationId
          ? {
              ...r,
              affects: [
                ...r.affects,
                {
                  id: crypto.randomUUID(),
                  path,
                  reason: "",
                  optional: false,
                  generated: false,
                  command: "",
                },
              ],
            }
          : r,
      ),
    );
  }

  function removeAffect(relationId: string, affectId: string) {
    pushUndo();
    setRelations((prev) =>
      prev.map((r) =>
        r.id === relationId ? { ...r, affects: r.affects.filter((a) => a.id !== affectId) } : r,
      ),
    );
  }

  // Text input updates — no pushUndo per keystroke
  function updateAffect(relationId: string, affectId: string, updates: Partial<EditableAffect>) {
    setRelations((prev) =>
      prev.map((r) =>
        r.id === relationId
          ? {
              ...r,
              affects: r.affects.map((a) => (a.id === affectId ? { ...a, ...updates } : a)),
            }
          : r,
      ),
    );
  }

  // Toggle-type updates do get undo
  function toggleAffectOptional(relationId: string, affectId: string) {
    pushUndo();
    setRelations((prev) =>
      prev.map((r) =>
        r.id === relationId
          ? {
              ...r,
              affects: r.affects.map((a) =>
                a.id === affectId ? { ...a, optional: !a.optional } : a,
              ),
            }
          : r,
      ),
    );
  }

  function updateIgnorePatterns(value: string) {
    setIgnorePatterns(value);
  }

  const handleDrop = useCallback(
    (relationId: string) => (e: React.DragEvent) => {
      e.preventDefault();
      const path = e.dataTransfer.getData("text/plain");
      if (path) addAffect(relationId, path);
    },
    [relations, ignorePatterns],
  );

  async function handleSave() {
    if (!selectedPackage) return;
    const success = await saveConfig(selectedPackage, yamlPreview);
    if (success) {
      toast.success("Saved", {
        description: `${selectedPackage}/kontext.yaml`,
      });
      onSaved();
    } else {
      toast.error("Save failed");
    }
  }

  async function handleCreateNew() {
    if (!newPkgPath.trim()) return;
    const defaultYaml = 'apiVersion: "kontext/v1"\n\nrelations: []\n';
    const success = await saveConfig(newPkgPath.trim(), defaultYaml);
    if (success) {
      toast.success("Created", {
        description: `${newPkgPath.trim()}/kontext.yaml`,
      });
      setSelectedPackage(newPkgPath.trim());
      setShowNewPkgInput(false);
      setNewPkgPath("");
      onSaved();
    } else {
      toast.error("Failed to create kontext.yaml");
    }
  }

  return (
    <div className="flex h-full">
      {/* Left: Kontexts + File tree (resizable) */}
      <div
        className="shrink-0 border-r border-border bg-sidebar-background flex flex-col"
        style={{ width: `${filePanelWidth}px` }}
      >
        {/* KONTEXTS quick access */}
        <div className="px-3 pt-3 pb-1">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Kontexts
            </h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setShowNewPkgInput(!showNewPkgInput)}
                  className="text-muted-foreground/50 hover:text-primary transition-colors"
                >
                  <FilePlus className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Create new kontext.yaml</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* New kontext.yaml input */}
        {showNewPkgInput && (
          <div className="px-2 pb-2 flex gap-1">
            <Input
              value={newPkgPath}
              onChange={(e) => setNewPkgPath(e.target.value)}
              placeholder="packages/my-pkg"
              className="font-mono text-[11px] h-6 flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateNew();
                if (e.key === "Escape") setShowNewPkgInput(false);
              }}
              autoFocus
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCreateNew}
              className="h-6 px-2 text-[10px]"
            >
              Create
            </Button>
          </div>
        )}

        {/* Kontext file list */}
        <div className="px-1 pb-2">
          {kontextFiles.length === 0 ? (
            <div className="px-3 py-1.5 text-[11px] text-muted-foreground/40">
              No kontext.yaml found
            </div>
          ) : (
            kontextFiles.map((file) => {
              const pkgDir = file.replace("/kontext.yaml", "");
              return (
                <button
                  key={file}
                  type="button"
                  onClick={() => setSelectedPackage(pkgDir)}
                  className={cn(
                    "flex w-full items-start gap-1.5 rounded px-2.5 py-1.5 cursor-pointer transition-all duration-100",
                    "hover:bg-[oklch(0.20_0.04_250)]",
                    selectedPackage === pkgDir
                      ? "bg-[oklch(0.18_0.04_250)] text-primary"
                      : "text-foreground/70",
                  )}
                >
                  <Sparkles className="h-3 w-3 shrink-0 text-primary/70 mt-0.5" />
                  <div className="min-w-0 flex-1 text-left">
                    <div className="truncate font-mono text-[12px] font-medium">
                      {getPackageLabel(pkgDir)}
                    </div>
                    <div className="truncate text-[10px] text-muted-foreground/50">{file}</div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="dither-divider mx-2" />

        {/* File tree */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <FileTree
            loadDir={fileTree.loadDir}
            getEntries={fileTree.getEntries}
            isLoading={fileTree.isLoading}
            onKontextClick={(pkgDir) => setSelectedPackage(pkgDir)}
          />
        </div>
      </div>

      {/* Left resize handle */}
      <ResizeHandle
        direction="right"
        onResize={(delta) => setFilePanelWidth((w) => Math.max(160, Math.min(400, w + delta)))}
      />

      {/* Center: Relation editor */}
      <div className="flex-1 min-w-0">
        <ScrollArea className="h-full">
          <div className="max-w-2xl px-5 py-4 space-y-4">
            {/* Compact package selector + undo/save toolbar */}
            <div className="flex items-center gap-2 flex-wrap">
              {packages.map((pkg) => (
                <button
                  key={pkg}
                  type="button"
                  onClick={() => setSelectedPackage(pkg)}
                  className={cn(
                    "flex items-center gap-1.5 rounded px-2 py-1 text-[11px] font-mono cursor-pointer transition-colors",
                    selectedPackage === pkg
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground/60 hover:bg-accent/30 hover:text-muted-foreground",
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", getPackageDotColor(pkg))} />
                  {getPackageLabel(pkg)}
                </button>
              ))}
              <div className="flex-1" />
              {(history.canUndo || history.canRedo) && (
                <div className="flex items-center gap-0.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={!history.canUndo}
                        onClick={() => {
                          const prev = history.undo({ relations, ignorePatterns });
                          if (prev) {
                            setRelations(prev.relations);
                            setIgnorePatterns(prev.ignorePatterns);
                            toast.info("Undo");
                          }
                        }}
                        className="h-6 w-6 p-0 text-muted-foreground"
                      >
                        <Undo2 className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Undo (Cmd+Z)</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={!history.canRedo}
                        onClick={() => {
                          const next = history.redo({ relations, ignorePatterns });
                          if (next) {
                            setRelations(next.relations);
                            setIgnorePatterns(next.ignorePatterns);
                            toast.info("Redo");
                          }
                        }}
                        className="h-6 w-6 p-0 text-muted-foreground"
                      >
                        <Redo2 className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Redo (Cmd+Shift+Z)</TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>

            {selectedPackage && (
              <>
                {/* Selected package path */}
                <div className="font-mono text-[11px] text-muted-foreground/50">
                  {selectedPackage}/kontext.yaml
                </div>

                {/* Ignore patterns */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground">
                    Ignore
                  </label>
                  <Input
                    value={ignorePatterns}
                    onChange={(e) => updateIgnorePatterns(e.target.value)}
                    onBlur={onFieldBlur}
                    placeholder="*.test.tsx, *.namespace.tsx"
                    className="font-mono text-xs h-7"
                  />
                </div>

                <Separator />

                {/* Relations */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground">
                      Relations
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addRelation}
                      className="h-6 gap-1 text-[11px]"
                    >
                      <Plus className="h-3 w-3" />
                      Add
                    </Button>
                  </div>

                  {relations.map((rel) => (
                    <div
                      key={rel.id}
                      className="rounded-lg border border-border bg-card space-y-2.5 p-3"
                    >
                      {/* When pattern */}
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground shrink-0">
                          when
                        </span>
                        <Input
                          value={rel.when}
                          onChange={(e) => updateRelationWhen(rel.id, e.target.value)}
                          onBlur={onFieldBlur}
                          placeholder="src/commands/**"
                          className="font-mono text-xs h-7 flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRelation(rel.id)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      {/* Affects (drop zone) */}
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.add("ring-1", "ring-primary/50");
                        }}
                        onDragLeave={(e) => {
                          e.currentTarget.classList.remove("ring-1", "ring-primary/50");
                        }}
                        onDrop={(e) => {
                          e.currentTarget.classList.remove("ring-1", "ring-primary/50");
                          handleDrop(rel.id)(e);
                        }}
                        className="rounded-md border border-dashed border-border/50 p-2.5 min-h-[48px] transition-all"
                      >
                        <div className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1.5">
                          affects
                        </div>
                        {rel.affects.length === 0 ? (
                          <p className="text-[11px] text-muted-foreground/40 text-center py-1.5">
                            Drop files here or add manually
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {rel.affects.map((affect) => (
                              <div key={affect.id} className="rounded bg-background/50 group">
                                <div className="flex items-center gap-1.5 px-1.5 py-1">
                                  <GripVertical className="h-3 w-3 text-muted-foreground/20 shrink-0" />
                                  <Input
                                    value={affect.path}
                                    onChange={(e) =>
                                      updateAffect(rel.id, affect.id, { path: e.target.value })
                                    }
                                    onBlur={onFieldBlur}
                                    placeholder="path/to/file"
                                    className="font-mono text-[11px] h-6 flex-1"
                                  />
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <button
                                        type="button"
                                        onClick={() => toggleAffectOptional(rel.id, affect.id)}
                                        className={cn(
                                          "text-[9px] uppercase px-1.5 py-0.5 rounded transition-colors",
                                          affect.optional
                                            ? "bg-[oklch(0.75_0.15_85/0.15)] text-[oklch(0.75_0.15_85)]"
                                            : "text-muted-foreground/30 hover:text-muted-foreground",
                                        )}
                                      >
                                        opt
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent>Toggle optional</TooltipContent>
                                  </Tooltip>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeAffect(rel.id, affect.id)}
                                    className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                                <div className="px-1.5 pb-1.5">
                                  <Input
                                    value={affect.reason}
                                    onChange={(e) =>
                                      updateAffect(rel.id, affect.id, { reason: e.target.value })
                                    }
                                    onBlur={onFieldBlur}
                                    placeholder="reason..."
                                    className="text-[10px] h-5 text-muted-foreground/70 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/25"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addAffect(rel.id, "")}
                          className="h-5 mt-1.5 gap-1 text-[10px] text-muted-foreground"
                        >
                          <Plus className="h-3 w-3" />
                          Add path
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {!selectedPackage && (
              <div className="py-16 text-center text-muted-foreground/40 text-sm">
                Select a kontext file or package to edit
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Right resize handle */}
      <ResizeHandle
        direction="left"
        onResize={(delta) => setYamlPanelWidth((w) => Math.max(200, Math.min(600, w + delta)))}
      />

      {/* Right: YAML preview (resizable) */}
      <div
        className="shrink-0 bg-sidebar-background flex flex-col"
        style={{ width: `${yamlPanelWidth}px` }}
      >
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <h3 className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
            YAML Preview
          </h3>
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            disabled={!selectedPackage || saving}
            className="h-6 gap-1.5 text-[11px]"
          >
            <Save className="h-3 w-3" />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <pre className="p-4 font-mono text-[11px] leading-relaxed text-foreground/70 whitespace-pre-wrap">
            {selectedPackage ? yamlPreview : "Select a package to edit"}
          </pre>
        </ScrollArea>
      </div>
    </div>
  );
}

// --- YAML parsing/generation helpers ---

function parseYamlToRelations(content: string): {
  relations: EditableRelation[];
  ignore: string;
} {
  const lines = content.split("\n");
  const relations: EditableRelation[] = [];
  let ignore = "";
  let currentRelation: EditableRelation | null = null;
  let inRelations = false;
  let inIgnore = false;
  let inAffects = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("ignore:")) {
      inIgnore = true;
      inRelations = false;
      continue;
    }
    if (trimmed.startsWith("relations:")) {
      inRelations = true;
      inIgnore = false;
      continue;
    }

    if (inIgnore && trimmed.startsWith("- ")) {
      const pattern = trimmed.slice(2).replace(/^["']|["']$/g, "");
      ignore += (ignore ? ", " : "") + pattern;
      continue;
    }

    if (inRelations) {
      if (trimmed.startsWith("- when:")) {
        if (currentRelation) relations.push(currentRelation);
        currentRelation = {
          id: crypto.randomUUID(),
          when: trimmed
            .slice(7)
            .trim()
            .replace(/^["']|["']$/g, ""),
          affects: [],
        };
        inAffects = false;
        continue;
      }
      if (trimmed === "affects:" && currentRelation) {
        inAffects = true;
        continue;
      }
      if (inAffects && trimmed.startsWith("- path:") && currentRelation) {
        const path = trimmed
          .slice(7)
          .trim()
          .replace(/^["']|["']$/g, "");
        currentRelation.affects.push({
          id: crypto.randomUUID(),
          path,
          reason: "",
          optional: false,
          generated: false,
          command: "",
        });
        continue;
      }
      if (inAffects && trimmed.startsWith("reason:") && currentRelation) {
        const lastAffect = currentRelation.affects.at(-1);
        if (lastAffect) {
          lastAffect.reason = trimmed
            .slice(7)
            .trim()
            .replace(/^["']|["']$/g, "");
        }
        continue;
      }
      if (inAffects && trimmed.startsWith("optional:") && currentRelation) {
        const lastAffect = currentRelation.affects.at(-1);
        if (lastAffect) {
          lastAffect.optional = trimmed.includes("true");
        }
        continue;
      }
    }
  }
  if (currentRelation) relations.push(currentRelation);

  return { relations, ignore };
}

function generateYaml(relations: EditableRelation[], ignorePatterns: string): string {
  const lines: string[] = ['apiVersion: "kontext/v1"', ""];

  if (ignorePatterns.trim()) {
    lines.push("ignore:");
    for (const pattern of ignorePatterns
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean)) {
      lines.push(`  - "${pattern}"`);
    }
    lines.push("");
  }

  if (relations.length > 0) {
    lines.push("relations:");
    for (const rel of relations) {
      lines.push(`  - when: "${rel.when}"`);
      if (rel.affects.length > 0) {
        lines.push("    affects:");
        for (const affect of rel.affects) {
          lines.push(`      - path: "${affect.path}"`);
          if (affect.reason) {
            lines.push(`        reason: "${affect.reason}"`);
          }
          if (affect.optional) {
            lines.push("        optional: true");
          }
          if (affect.generated) {
            lines.push("        generated: true");
            if (affect.command) {
              lines.push(`        command: "${affect.command}"`);
            }
          }
        }
      }
    }
  }

  return lines.join("\n") + "\n";
}
