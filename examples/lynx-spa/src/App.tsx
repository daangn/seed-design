import { ActionButton } from "@seed-design/lynx-react";
import WorkingActionButton from "./WorkingActionButton.jsx";

export function App(props: { onRender?: () => void }) {
  props.onRender?.();

  return (
    <view
      style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <text
        style={{
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '12px',
          color: '#ff0000',
        }}
      >
        === Working (non-lynx recipe) ===
      </text>
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <WorkingActionButton variant="brandSolid">Brand Solid</WorkingActionButton>
        <WorkingActionButton variant="neutralSolid">Neutral Solid</WorkingActionButton>
        <WorkingActionButton variant="neutralWeak">Neutral Weak</WorkingActionButton>
        <WorkingActionButton variant="brandOutline">Brand Outline</WorkingActionButton>
        <WorkingActionButton variant="ghost">Ghost</WorkingActionButton>
      </view>

      <text
        style={{
          fontSize: '20px',
          fontWeight: 'bold',
          marginTop: '24px',
          marginBottom: '12px',
          color: '#0000ff',
        }}
      >
        === Lynx-React (slot recipe) ===
      </text>
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <ActionButton variant="brandSolid">Brand Solid</ActionButton>
        <ActionButton variant="neutralSolid">Neutral Solid</ActionButton>
        <ActionButton variant="neutralWeak">Neutral Weak</ActionButton>
        <ActionButton variant="brandOutline">Brand Outline</ActionButton>
        <ActionButton variant="ghost">Ghost</ActionButton>
      </view>

      <text
        style={{
          fontSize: '20px',
          fontWeight: 'bold',
          marginTop: '24px',
          marginBottom: '12px',
        }}
      >
        Sizes (lynx-react)
      </text>
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <ActionButton size="xsmall">XSmall</ActionButton>
        <ActionButton size="small">Small</ActionButton>
        <ActionButton size="medium">Medium</ActionButton>
        <ActionButton size="large">Large</ActionButton>
      </view>
    </view>
  );
}
