import { useState } from "react";

interface ChatInputProps {
  onSubmit: (prompt: string) => void;
  isGenerating: boolean;
}

export function ChatInput({ onSubmit, isGenerating }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isGenerating) return;
    onSubmit(value.trim());
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="UI를 설명해주세요... (예: 회원가입 폼 만들어줘)"
        disabled={isGenerating}
        style={{
          flex: 1,
          padding: "12px 16px",
          borderRadius: 12,
          border: "1px solid #e0e0e0",
          fontSize: 15,
          outline: "none",
        }}
      />
      <button
        type="submit"
        disabled={isGenerating || !value.trim()}
        style={{
          padding: "12px 24px",
          borderRadius: 12,
          border: "none",
          background: isGenerating ? "#ccc" : "#FF6F0F",
          color: "white",
          fontSize: 15,
          fontWeight: 600,
          cursor: isGenerating ? "not-allowed" : "pointer",
        }}
      >
        {isGenerating ? "생성 중..." : "생성"}
      </button>
    </form>
  );
}
