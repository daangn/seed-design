import ActionButton from "./components/action-button";

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
