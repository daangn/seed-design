import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { searchFiles } from "@/lib/graph-utils";
import { getPackageLabel } from "@/lib/packages";
import type { KontextGraph, SearchResult } from "@/types";

interface SearchDialogProps {
  graph: KontextGraph;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (packageDir: string) => void;
}

export function SearchDialog({ graph, open, onOpenChange, onNavigate }: SearchDialogProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => searchFiles(graph, query), [graph, query]);

  const forwardResults = results.filter((r) => r.direction === "affects");
  const reverseResults = results.filter((r) => r.direction === "affected-by");

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  function handleSelect(result: SearchResult) {
    onNavigate(result.packageDir);
    onOpenChange(false);
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search files..." value={query} onValueChange={setQuery} />
      <CommandList>
        <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
          No files found.
        </CommandEmpty>

        {forwardResults.length > 0 && (
          <CommandGroup heading="Affects (forward)">
            {forwardResults.slice(0, 15).map((r, i) => (
              <CommandItem key={`fwd-${i}`} onSelect={() => handleSelect(r)} className="gap-2">
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="min-w-0 flex-1 truncate font-mono text-xs">{r.relatedFile}</span>
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {getPackageLabel(r.packageDir)}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {reverseResults.length > 0 && (
          <CommandGroup heading="Affected by (reverse)">
            {reverseResults.slice(0, 15).map((r, i) => (
              <CommandItem key={`rev-${i}`} onSelect={() => handleSelect(r)} className="gap-2">
                <ArrowLeft className="h-3.5 w-3.5 shrink-0 text-[oklch(0.65_0.18_340)]" />
                <span className="min-w-0 flex-1 truncate font-mono text-xs">{r.relatedFile}</span>
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {getPackageLabel(r.packageDir)}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}

/** Hook for keyboard shortcut */
export function useSearchShortcut() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return { open, setOpen };
}
