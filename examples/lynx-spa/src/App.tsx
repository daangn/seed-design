import LynxActionButton from './lynx-components/ActionButton';

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
        <LynxActionButton variant="brandSolid">Brand Solid</LynxActionButton>
        <LynxActionButton variant="neutralSolid">
          Neutral Solid
        </LynxActionButton>
        <LynxActionButton variant="neutralWeak">Neutral Weak</LynxActionButton>
        <LynxActionButton variant="criticalSolid">
          Critical Solid
        </LynxActionButton>
        <LynxActionButton variant="brandOutline">
          Brand Outline
        </LynxActionButton>
        <LynxActionButton variant="neutralOutline">
          Neutral Outline
        </LynxActionButton>
        <LynxActionButton variant="ghost">Ghost</LynxActionButton>
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
        <LynxActionButton size="xsmall">XSmall</LynxActionButton>
        <LynxActionButton size="small">Small</LynxActionButton>
        <LynxActionButton size="medium">Medium</LynxActionButton>
        <LynxActionButton size="large">Large</LynxActionButton>
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
        <LynxActionButton variant="brandSolid" disabled>
          Disabled
        </LynxActionButton>
        <LynxActionButton variant="neutralOutline" disabled>
          Disabled Outline
        </LynxActionButton>
      </view>
    </view>
  );
}
