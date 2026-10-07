import { useState } from "@lynx-js/react";
import { ActionButton, useActionButtonContext } from "@seed-design/lynx-react-action-button";

function Surface() {
  const { pressed, loading } = useActionButtonContext();

  return (
    <view
      style={{
        padding: "12px 20px",
        borderRadius: "8px",
        backgroundColor: loading
          ? "var(--seed-color-bg-neutral-solid-muted)"
          : pressed
            ? "var(--seed-color-bg-neutral-solid-pressed)"
            : "var(--seed-color-bg-neutral-solid)",
      }}
    >
      <text style={{ color: "var(--seed-color-fg-on-neutral-solid)", fontWeight: "700" }}>
        {loading ? "저장 중" : "저장"}
      </text>
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
    <ActionButton.Root
      loading={loading}
      bindtap={handleTap}
      accessibility-label={loading ? "저장 중" : "저장"}
    >
      <Surface />
    </ActionButton.Root>
  );
}
