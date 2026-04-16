import { Search } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SearchDialog, useSearchShortcut } from "@/components/SearchDialog";
import { KontextView } from "@/views/KontextView";
import { useGraph } from "@/hooks/useGraph";

export function App() {
  const { graph, error, loading, rebuild } = useGraph();
  const search = useSearchShortcut();

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="max-w-sm text-center space-y-3">
          <h2 className="font-pixel text-lg tracking-wider text-destructive">CONNECTION FAILED</h2>
          <p className="text-sm text-muted-foreground">{error}</p>
          <p className="text-xs text-muted-foreground/50">
            Run <code className="font-mono">kontext serve</code> to start the server.
          </p>
        </div>
      </div>
    );
  }

  if (!graph || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-2">
          <div className="font-pixel text-sm tracking-widest text-muted-foreground animate-pulse">
            LOADING
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="dither-bg flex h-screen flex-col">
        {/* Header */}
        <div className="dither-accent-bar shrink-0" />
        <header className="flex shrink-0 items-center gap-4 border-b border-border px-5 py-2.5">
          <h1 className="font-pixel text-base tracking-widest">KONTEXT</h1>
          <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
            {graph.nodes.length} nodes / {graph.edges.length} edges
          </span>

          <div className="flex-1" />

          <Button
            variant="outline"
            size="sm"
            onClick={() => search.setOpen(true)}
            className="h-7 gap-2 text-xs text-muted-foreground"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="pointer-events-none hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-border px-1.5 font-mono text-[10px] text-muted-foreground/50">
              <span className="text-[10px]">&#8984;</span>K
            </kbd>
          </Button>
        </header>

        {/* Content — single unified view */}
        <main className="flex-1 overflow-hidden">
          <KontextView graph={graph} onSaved={rebuild} />
        </main>

        {/* Search dialog — only mount when open to avoid cmdk stealing focus */}
        {search.open && (
          <SearchDialog
            graph={graph}
            open={search.open}
            onOpenChange={search.setOpen}
            onNavigate={() => {}}
          />
        )}
      </div>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "oklch(0.12 0.005 260)",
            border: "1px solid oklch(0.20 0.005 260)",
            color: "oklch(0.93 0.005 260)",
            fontSize: "12px",
          },
        }}
      />
    </TooltipProvider>
  );
}
