import { ActionButton } from "@seed-design/lynx-react";
import { actionButton } from "@seed-design/css/recipes/action-button.lynx";
import LynxConsole from "lynx-console";
import "lynx-console/style.css";

function StateTestButtons() {
  const classes = actionButton({
    variant: "brandSolid",
    size: "medium",
    layout: "withText",
    disabled: true,
  });

  return (
    <view style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <text style={{ fontSize: "14px", color: "#666" }}>
        Test 1: recipe에 disabled 전달 (클래스 기반)
      </text>
      <view className={classes.root}>
        <text className={classes.text}>Disabled via Recipe</text>
      </view>

      <text style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>
        Test 2: :active pseudo-class (터치 시 자동)
      </text>
      <ActionButton variant="brandSolid">Touch Me</ActionButton>
    </view>
  );
}

export function App(props: { onRender?: () => void }) {
  props.onRender?.();

  return (
    <view
      style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <text
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          marginBottom: "12px",
          color: "#3498db",
        }}
      >
        === Lynx Slot Recipe (ActionButton) ===
      </text>
      <text
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          marginTop: "16px",
          marginBottom: "8px",
        }}
      >
        Variants
      </text>
      <view
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <ActionButton variant="brandSolid">Brand Solid</ActionButton>
        <ActionButton variant="neutralSolid">Neutral Solid</ActionButton>
        <ActionButton variant="neutralWeak">Neutral Weak</ActionButton>
        <ActionButton variant="criticalSolid">Critical Solid</ActionButton>
        <ActionButton variant="brandOutline">Brand Outline</ActionButton>
        <ActionButton variant="neutralOutline">Neutral Outline</ActionButton>
        <ActionButton variant="ghost">Ghost</ActionButton>
      </view>

      <text
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          marginTop: "16px",
          marginBottom: "8px",
        }}
      >
        Sizes
      </text>
      <view
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <ActionButton size="xsmall">XSmall</ActionButton>
        <ActionButton size="small">Small</ActionButton>
        <ActionButton size="medium">Medium</ActionButton>
        <ActionButton size="large">Large</ActionButton>
      </view>

      <text
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          marginTop: "16px",
          marginBottom: "8px",
        }}
      >
        State Tests
      </text>
      <StateTestButtons />

      <text
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          marginTop: "16px",
          marginBottom: "8px",
        }}
      >
        Disabled
      </text>
      <view
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <ActionButton variant="brandSolid" disabled>
          Disabled
        </ActionButton>
        <ActionButton variant="neutralOutline" disabled>
          Disabled Outline
        </ActionButton>
      </view>
      {/* LynxConsole: floating developer console for debugging */}
      <LynxConsole theme="light" safeAreaInsetBottom="34px" />
    </view>
  );
}
