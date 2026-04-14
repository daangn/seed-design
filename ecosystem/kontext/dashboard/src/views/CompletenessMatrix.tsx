import type { KontextGraph } from "../types.js";

interface ComponentRow {
  id: string;
  layers: Record<string, boolean>;
}

const LAYER_ORDER = [
  "packages/rootage",
  "packages/qvism-preset",
  "packages/css",
  "packages/react",
  "docs",
];

const LAYER_LABELS: Record<string, string> = {
  "packages/rootage": "spec",
  "packages/qvism-preset": "recipe",
  "packages/css": "css",
  "packages/react": "react",
  docs: "docs",
};

export function CompletenessMatrix({ graph }: { graph: KontextGraph }) {
  // 컴포넌트 ID별로 어떤 패키지에 파일이 있는지 집계
  const componentMap = new Map<string, Record<string, boolean>>();

  for (const node of graph.nodes) {
    if (!node.exists) continue;
    const id = extractComponentId(node.id);
    if (!id) continue;

    const layers = componentMap.get(id) ?? {};
    layers[node.packageDir] = true;
    componentMap.set(id, layers);
  }

  const rows: ComponentRow[] = Array.from(componentMap.entries())
    .map(([id, layers]) => ({ id, layers }))
    .sort((a, b) => a.id.localeCompare(b.id));

  return (
    <div style={{ padding: 24, overflow: "auto" }}>
      <h2 style={{ marginBottom: 16, fontSize: 18 }}>Component Completeness</h2>
      <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 13 }}>
        <thead>
          <tr>
            <th style={thStyle}>Component</th>
            {LAYER_ORDER.map((l) => (
              <th key={l} style={{ ...thStyle, textAlign: "center" }}>
                {LAYER_LABELS[l] ?? l}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td style={tdStyle}>{row.id}</td>
              {LAYER_ORDER.map((l) => (
                <td
                  key={l}
                  style={{ ...tdStyle, textAlign: "center" }}
                  aria-label={row.layers[l] ? "exists" : "missing"}
                >
                  {row.layers[l] ? (
                    <span style={{ color: "#22c55e" }} aria-hidden="true">
                      ●
                    </span>
                  ) : (
                    <span style={{ color: "#555" }} aria-hidden="true">
                      ○
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 12, color: "#666", fontSize: 12 }}>
        {rows.length} components found
      </div>
    </div>
  );
}

function extractComponentId(filePath: string): string | null {
  const parts = filePath.split("/");
  const name = parts.pop()?.replace(/\.[^.]+$/, "");
  if (!name || name === "index") return null;

  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

const thStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderBottom: "1px solid #333",
  textAlign: "left",
  color: "#999",
  fontWeight: 500,
};

const tdStyle: React.CSSProperties = {
  padding: "6px 12px",
  borderBottom: "1px solid #1a1a1a",
};
