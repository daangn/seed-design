import { useState } from "react";
import { useGraph } from "./hooks/useGraph.js";
import { CompletenessMatrix } from "./views/CompletenessMatrix.js";
import { GraphExplorer } from "./views/GraphExplorer.js";
import type { ViewMode } from "./types.js";

export function App() {
  const { graph, error } = useGraph();
  const [view, setView] = useState<ViewMode>("graph");

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>Failed to load graph</h2>
        <p style={{ color: "#999" }}>{error}</p>
        <p style={{ color: "#666", marginTop: 8 }}>Run `kontext serve` to start the server.</p>
      </div>
    );
  }

  if (!graph) {
    return <div style={{ padding: 40, textAlign: "center", color: "#999" }}>Loading graph...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* 헤더 */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "12px 24px",
          borderBottom: "1px solid #222",
          background: "#111",
        }}
      >
        <h1 style={{ fontSize: 16, fontWeight: 600 }}>Kontext</h1>
        <span style={{ color: "#666", fontSize: 13 }}>
          {graph.nodes.length} nodes · {graph.edges.length} edges
        </span>
        <div style={{ flex: 1 }} />
        <nav style={{ display: "flex", gap: 4 }}>
          <TabButton active={view === "graph"} onClick={() => setView("graph")}>
            Graph
          </TabButton>
          <TabButton active={view === "matrix"} onClick={() => setView("matrix")}>
            Matrix
          </TabButton>
        </nav>
      </header>

      {/* 콘텐츠 */}
      <main style={{ flex: 1, overflow: "hidden" }}>
        {view === "graph" && <GraphExplorer graph={graph} />}
        {view === "matrix" && <CompletenessMatrix graph={graph} />}
      </main>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        padding: "6px 14px",
        borderRadius: 6,
        border: "none",
        background: active ? "#333" : "transparent",
        color: active ? "#fff" : "#888",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 500,
      }}
    >
      {children}
    </button>
  );
}
