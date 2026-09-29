import { useState } from "@lynx-js/react";
import { Callout, useCalloutContext } from "@seed-design/lynx-react-callout";

function Message({ children }: { children: string }) {
  const { pressed } = useCalloutContext("Message");

  return (
    <text
      style={{
        flexGrow: 1,
        flexShrink: 1,
        fontSize: "14px",
        color: pressed ? "#8b8b8b" : "#1a1c20",
      }}
    >
      {children}
    </text>
  );
}

const rootStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  padding: "12px 16px",
  borderRadius: "10px",
  backgroundColor: "#f2f3f6",
} as const;

export default function Example() {
  const [tapCount, setTapCount] = useState(0);
  const [open, setOpen] = useState(true);

  function handleTap() {
    "background only";
    setTapCount((count) => count + 1);
  }

  function handleDismiss() {
    "background only";
    setOpen(false);
  }

  function handleReopen() {
    "background only";
    setOpen(true);
  }

  return (
    <view style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "16px" }}>
      <Callout.Root style={rootStyle}>
        <Message>텍스트만 전달하는 안내예요.</Message>
      </Callout.Root>

      <Callout.Root style={rootStyle} bindtap={handleTap} accessibility-label="상세 내용 확인">
        <Message>{`탭해서 상세 내용을 확인하세요. (${tapCount})`}</Message>
      </Callout.Root>

      <Callout.Root style={rootStyle} open={open} onDismiss={handleDismiss}>
        <Message>설정이 저장되었어요.</Message>
        <Callout.CloseButton accessibility-label="닫기" style={{ padding: "4px 8px" }}>
          <text style={{ fontSize: "14px", color: "#555d6d" }}>닫기</text>
        </Callout.CloseButton>
      </Callout.Root>

      {open ? null : (
        <view
          bindtap={handleReopen}
          accessibility-element
          accessibility-traits="button"
          accessibility-label="다시 표시"
          style={{ padding: "8px" }}
        >
          <text style={{ fontSize: "14px", color: "#0e74ff" }}>다시 표시</text>
        </view>
      )}
    </view>
  );
}
