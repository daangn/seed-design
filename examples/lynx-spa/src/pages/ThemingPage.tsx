import { ActionButton } from '@seed-design/lynx-react';
import { getThemeClassName } from '@seed-design/rsbuild-plugin/lynx';

declare const __SEED_COLOR_MODE__: string;

export function ThemingPage() {
  const colorMode =
    typeof __SEED_COLOR_MODE__ !== 'undefined' ? __SEED_COLOR_MODE__ : 'system';
  const globalProps = lynx?.__globalProps as
    | Record<string, unknown>
    | undefined;
  const systemTheme = (globalProps?.theme as string) ?? 'unknown';
  const frontendTheme = (globalProps?.frontendTheme as string) ?? 'unknown';
  const themeClass = getThemeClassName(
    colorMode as 'system' | 'light-only' | 'dark-only',
    systemTheme,
  );

  return (
    <view style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <text style={{ fontSize: '20px', fontWeight: 'bold' }}>Theming</text>

      <view
        style={{
          padding: '12px',
          backgroundColor: '#f0f0f0',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        <text style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
          Environment
        </text>
        <text style={{ fontSize: '13px', color: '#555' }}>
          colorMode (plugin): "{colorMode}"
        </text>
        <text style={{ fontSize: '13px', color: '#555' }}>
          systemTheme (device): "{systemTheme}"
        </text>
        <text style={{ fontSize: '13px', color: '#555' }}>
          frontendTheme (app): "{frontendTheme}"
        </text>
        <text style={{ fontSize: '13px', color: '#555' }}>
          Applied class: "{themeClass}"
        </text>
      </view>

      <text style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>
        Theme Preview
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
        <ActionButton variant="criticalSolid">Critical Solid</ActionButton>
      </view>
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <ActionButton variant="brandOutline">Brand Outline</ActionButton>
        <ActionButton variant="neutralOutline">Neutral Outline</ActionButton>
        <ActionButton variant="ghost">Ghost</ActionButton>
      </view>
    </view>
  );
}
