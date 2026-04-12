import { useState } from "react";
import { ChatInput } from "./components/ChatInput";
import { PreviewPanel } from "./components/PreviewPanel";
import { CodePanel } from "./components/CodePanel";
import { useGenerateUI } from "./hooks/useGenerateUI";

export function App() {
  const [apiKey, setApiKey] = useState(() => import.meta.env.VITE_ANTHROPIC_API_KEY ?? "");
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const { spec, code, isGenerating, error, generate, reset } = useGenerateUI(apiKey);

  if (!apiKey) {
    return (
      <div style={{ maxWidth: 480, margin: "80px auto", padding: 24 }}>
        <h2 style={{ marginBottom: 16 }}>SEED Design - Generative UI</h2>
        <p style={{ color: "#666", marginBottom: 16 }}>Claude API 키를 입력해주세요.</p>
        <input
          type="password"
          placeholder="sk-ant-..."
          onChange={(e) => setApiKey(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: 12,
            border: "1px solid #e0e0e0",
            fontSize: 15,
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "12px 24px",
          borderBottom: "1px solid #e8e8e8",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1 style={{ fontSize: 18, fontWeight: 700 }}>SEED Generative UI</h1>
        <button
          type="button"
          onClick={reset}
          style={{
            padding: "6px 16px",
            borderRadius: 8,
            border: "1px solid #ddd",
            background: "white",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          초기화
        </button>
      </header>

      {/* Main content */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left: Preview/Code panels */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid #e8e8e8",
          }}
        >
          {/* Tab bar */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid #e8e8e8",
              padding: "0 16px",
            }}
          >
            {(["preview", "code"] as const).map((tab) => (
              <button
                type="button"
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "10px 16px",
                  border: "none",
                  background: "none",
                  fontSize: 14,
                  fontWeight: activeTab === tab ? 600 : 400,
                  color: activeTab === tab ? "#FF6F0F" : "#666",
                  borderBottom: activeTab === tab ? "2px solid #FF6F0F" : "2px solid transparent",
                  cursor: "pointer",
                }}
              >
                {tab === "preview" ? "프리뷰" : "코드"}
              </button>
            ))}
          </div>

          {/* Panel content */}
          <div style={{ flex: 1, overflow: "auto" }}>
            {activeTab === "preview" ? <PreviewPanel spec={spec} /> : <CodePanel code={code} />}
          </div>
        </div>
      </div>

      {/* Bottom: Chat input */}
      <div
        style={{
          padding: "16px 24px",
          borderTop: "1px solid #e8e8e8",
          background: "white",
        }}
      >
        {error && (
          <div
            style={{
              padding: "8px 12px",
              marginBottom: 8,
              borderRadius: 8,
              background: "#FFF0F0",
              color: "#D00",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}
        <ChatInput onSubmit={generate} isGenerating={isGenerating} />
      </div>
    </div>
  );
}
