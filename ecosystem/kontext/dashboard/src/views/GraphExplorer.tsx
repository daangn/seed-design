import { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";
import type { KontextGraph } from "../types.js";

const PACKAGE_COLORS: Record<string, string> = {
  "packages/rootage": "#4a9eff",
  "packages/qvism-preset": "#22c55e",
  "packages/css": "#a78bfa",
  "packages/react": "#f472b6",
  "packages/react-headless": "#fb923c",
  "packages/cli": "#facc15",
  docs: "#38bdf8",
};

function getColor(packageDir: string): string {
  return PACKAGE_COLORS[packageDir] ?? "#6b7280";
}

export function GraphExplorer({ graph }: { graph: KontextGraph }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const elements: cytoscape.ElementDefinition[] = [];

    for (const node of graph.nodes) {
      elements.push({
        data: {
          id: node.id,
          label: node.id.replace(/\/$/, "").split("/").pop() || node.id,
          packageDir: node.packageDir,
          color: getColor(node.packageDir),
          exists: node.exists,
        },
      });
    }

    for (let i = 0; i < graph.edges.length; i++) {
      const edge = graph.edges[i]!;
      elements.push({
        data: {
          id: `e${i}`,
          source: edge.source,
          target: edge.target,
          label: edge.generated ? "auto" : (edge.reason ?? ""),
          generated: edge.generated,
        },
      });
    }

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: "node",
          style: {
            "background-color": "data(color)",
            label: "data(label)",
            "font-size": "10px",
            color: "#e0e0e0",
            "text-valign": "bottom",
            "text-margin-y": 6,
            width: 20,
            height: 20,
            "border-width": 1,
            "border-color": "#333",
          },
        },
        {
          selector: "node[?exists]",
          style: { opacity: 1 },
        },
        {
          selector: "node[!exists]",
          style: { opacity: 0.4, "border-style": "dashed" },
        },
        {
          selector: "edge",
          style: {
            width: 1,
            "line-color": "#444",
            "target-arrow-color": "#444",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            "arrow-scale": 0.8,
          },
        },
        {
          selector: "edge[?generated]",
          style: {
            "line-style": "dashed",
            "line-color": "#555",
          },
        },
        {
          selector: "node:selected",
          style: {
            "border-width": 3,
            "border-color": "#fff",
          },
        },
        {
          selector: ".highlighted",
          style: {
            "line-color": "#4a9eff",
            "target-arrow-color": "#4a9eff",
            width: 2,
          },
        },
      ],
      layout: {
        name: "cose",
        animate: false,
        nodeDimensionsIncludeLabels: true,
        idealEdgeLength: () => 120,
        nodeRepulsion: () => 8000,
      },
    });

    cy.on("tap", "node", (evt) => {
      const nodeId = evt.target.id();
      setSelected(nodeId);

      cy.edges().removeClass("highlighted");
      evt.target.connectedEdges().addClass("highlighted");
    });

    cy.on("tap", (evt) => {
      if (evt.target === cy) {
        setSelected(null);
        cy.edges().removeClass("highlighted");
      }
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, [graph]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

      {/* 범례 */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          background: "rgba(20,20,20,0.9)",
          padding: "12px 16px",
          borderRadius: 8,
          fontSize: 12,
        }}
      >
        {Object.entries(PACKAGE_COLORS).map(([pkg, color]) => (
          <div key={pkg} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
            <span>{pkg}</span>
          </div>
        ))}
      </div>

      {/* 선택된 노드 정보 */}
      {selected && (
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: 16,
            right: 16,
            background: "rgba(20,20,20,0.95)",
            padding: "12px 16px",
            borderRadius: 8,
            fontSize: 13,
          }}
        >
          <strong>{selected}</strong>
          <div style={{ marginTop: 8, color: "#999" }}>
            {graph.edges
              .filter((e) => e.source === selected || e.target === selected)
              .slice(0, 8)
              .map((e, i) => (
                <div key={i}>
                  {e.source === selected ? "→" : "←"} {e.source === selected ? e.target : e.source}
                  {e.reason && <span style={{ color: "#666" }}> — {e.reason}</span>}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
