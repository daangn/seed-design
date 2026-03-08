import { ActionButton } from "@seed-design/lynx-react";
import { WorkingActionButton } from "./WorkingActionButton";

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
          color: '#e74c3c',
        }}
      >
        === Web Recipe (WorkingActionButton) ===
      </text>
      <view style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
        <WorkingActionButton variant="brandSolid">Brand Solid</WorkingActionButton>
        <WorkingActionButton variant="neutralSolid">Neutral Solid</WorkingActionButton>
        <WorkingActionButton variant="neutralWeak">Neutral Weak</WorkingActionButton>
      </view>
      <view style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        <WorkingActionButton size="xsmall">XSmall</WorkingActionButton>
        <WorkingActionButton size="small">Small</WorkingActionButton>
        <WorkingActionButton size="medium">Medium</WorkingActionButton>
        <WorkingActionButton size="large">Large</WorkingActionButton>
      </view>

      <text
        style={{
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '12px',
          color: '#3498db',
        }}
      >
        === Lynx Slot Recipe (ActionButton) ===
      </text>
      <text
        style={{
          fontSize: '18px',
          fontWeight: 'bold',
          marginTop: '16px',
          marginBottom: '8px',
        }}
      >
        Variants
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
        <ActionButton variant="neutralSolid">
          Neutral Solid
        </ActionButton>
        <ActionButton variant="neutralWeak">Neutral Weak</ActionButton>
        <ActionButton variant="criticalSolid">
          Critical Solid
        </ActionButton>
        <ActionButton variant="brandOutline">
          Brand Outline
        </ActionButton>
        <ActionButton variant="neutralOutline">
          Neutral Outline
        </ActionButton>
        <ActionButton variant="ghost">Ghost</ActionButton>
      </view>

      <text
        style={{
          fontSize: '18px',
          fontWeight: 'bold',
          marginTop: '16px',
          marginBottom: '8px',
        }}
      >
        Sizes
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

      <text
        style={{
          fontSize: '18px',
          fontWeight: 'bold',
          marginTop: '16px',
          marginBottom: '8px',
        }}
      >
        Disabled
      </text>
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <ActionButton variant="brandSolid" disabled>
          Disabled
        </ActionButton>
        <ActionButton variant="neutralOutline" disabled>
          Disabled Outline
        </ActionButton>
      </view>
    </view>
  );
}
