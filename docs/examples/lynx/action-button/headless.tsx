import { useState } from "@lynx-js/react";
import { ActionButton, useActionButtonContext } from "@seed-design/lynx-react-action-button";

function Surface() {
  const { pressed, loading } = useActionButtonContext("Surface");

  return (
    <view
      style={{
        padding: "12px 20px",
        borderRadius: "8px",
        backgroundColor: loading ? "#8b8b8b" : pressed ? "#3a3a3c" : "#212124",
      }}
    >
      <text style={{ color: "#ffffff", fontWeight: "700" }}>{loading ? "저장 중" : "저장"}</text>
    </view>
  );
}

export default function Example() {
  const [loading, setLoading] = useState(false);

  function handleTap() {
    "background only";
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  }

  return (
    <view style={{ height: "100%", alignItems: "center", justifyContent: "center" }}>
      <ActionButton.Root
        loading={loading}
        bindtap={handleTap}
        accessibility-label={loading ? "저장 중" : "저장"}
      >
        <Surface />
      </ActionButton.Root>
    </view>
  );
}
