interface CodePanelProps {
  code: string;
}

export function CodePanel({ code }: CodePanelProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  if (!code) {
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
        생성이 완료되면 여기에 코드가 표시됩니다
      </div>
    );
  }

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <button
        type="button"
        onClick={handleCopy}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          padding: "6px 12px",
          borderRadius: 6,
          border: "1px solid #ddd",
          background: "white",
          fontSize: 12,
          cursor: "pointer",
        }}
      >
        복사
      </button>
      <pre
        style={{
          margin: 0,
          padding: 16,
          fontSize: 13,
          lineHeight: 1.6,
          overflow: "auto",
          height: "100%",
          background: "#f8f9fa",
          borderRadius: 8,
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
