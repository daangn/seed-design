import { Renderer, JSONUIProvider } from "@json-render/react";
import type { Spec } from "@json-render/core";
import { seedRegistry } from "@seed-design/json-render/registry";
import { isNonEmptySpec } from "@seed-design/json-render";
import { ErrorBoundary } from "./ErrorBoundary";

interface PreviewPanelProps {
  spec: Spec | null;
}

export function PreviewPanel({ spec }: PreviewPanelProps) {
  if (!spec || !isNonEmptySpec(spec)) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "#999",
          fontSize: 14,
        }}
      >
        프롬프트를 입력하면 여기에 프리뷰가 표시됩니다
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <ErrorBoundary>
        <JSONUIProvider registry={seedRegistry} spec={spec}>
          <Renderer spec={spec} registry={seedRegistry} />
        </JSONUIProvider>
      </ErrorBoundary>
    </div>
  );
}
