import { vars } from '@seed-design/lynx-css/vars';
import { ActionButton, getSeedClassName } from '@seed-design/lynx-react';

const { $color } = vars;

type ColorMode = 'system' | 'light-only' | 'dark-only';

type LynxRuntime = typeof globalThis & {
  lynx?: {
    __globalProps?: Record<string, unknown> | null;
  };
  SystemInfo?: {
    platform?: string;
  };
};

const runtime = globalThis as LynxRuntime;

function getGlobalProps() {
  return runtime.lynx?.__globalProps ?? {};
}

function getRuntimePlatform() {
  return runtime.SystemInfo?.platform ?? 'unknown';
}

function getFallbackSeedClassName(colorMode: ColorMode) {
  const systemTheme = String(getGlobalProps().theme ?? '').toLowerCase();
  const resolvedTheme =
    colorMode === 'dark-only' ||
    (colorMode === 'system' && systemTheme === 'dark')
      ? 'dark'
      : 'light';
  const platformClass =
    getRuntimePlatform() === 'iOS'
      ? 'seed-platform-ios'
      : 'seed-platform-android';

  return `seed-user-color-scheme-${resolvedTheme} ${platformClass}`;
}

function getSafeSeedClassName(colorMode: ColorMode) {
  try {
    return getSeedClassName({ colorMode });
  } catch {
    return getFallbackSeedClassName(colorMode);
  }
}

function SectionTitle({ children }: { children: string }) {
  return (
    <text
      style={{
        fontSize: '16px',
        fontWeight: 'bold',
        marginTop: '16px',
        marginBottom: '8px',
        color: $color.fg.neutral,
      }}
    >
      {children}
    </text>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <view
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
      }}
    >
      <text style={{ fontSize: '12px', color: $color.fg.neutralSubtle }}>
        {label}
      </text>
      <text style={{ fontSize: '13px', color: $color.fg.neutral }}>
        {value}
      </text>
    </view>
  );
}

function TokenLine({ name, value }: { name: string; value: string }) {
  return (
    <view
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <view
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '4px',
          borderWidth: '1px',
          borderColor: $color.stroke.neutralMuted,
          backgroundColor: value,
        }}
      />
      <text style={{ fontSize: '12px', color: $color.fg.neutralMuted }}>
        {name}
      </text>
    </view>
  );
}

function ThemeSurface({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <view
      className={className}
      style={{
        padding: '12px',
        borderRadius: '8px',
        borderWidth: '1px',
        borderColor: $color.stroke.neutralMuted,
        backgroundColor: $color.bg.layerDefault,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <view style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <text
          style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: $color.fg.neutral,
          }}
        >
          {title}
        </text>
        <text style={{ fontSize: '12px', color: $color.fg.neutralSubtle }}>
          {description}
        </text>
      </view>

      <view
        style={{
          padding: '10px',
          borderRadius: '6px',
          backgroundColor: $color.bg.neutralWeak,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        <text style={{ fontSize: '13px', color: $color.fg.neutral }}>
          CSS variables inherit through this surface.
        </text>
        <TokenLine name="bg.neutralWeak" value={$color.bg.neutralWeak} />
        <TokenLine name="fg.neutral" value={$color.fg.neutral} />
        <TokenLine
          name="stroke.neutralMuted"
          value={$color.stroke.neutralMuted}
        />
      </view>

      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <ActionButton size="small" variant="brandSolid">
          Brand
        </ActionButton>
        <ActionButton size="small" variant="neutralWeak">
          Neutral
        </ActionButton>
      </view>
    </view>
  );
}

function TailwindTokenPreview({ className }: { className?: string }) {
  return (
    <view
      className={className}
      style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
    >
      <view className="bg-bg-layer-default border border-stroke-neutral-muted rounded-lg p-3">
        <text className="t4-bold text-fg-neutral">Tailwind token surface</text>
        <text className="t3-regular text-fg-neutral-subtle">
          bg-bg-layer-default / text-fg-neutral / border-stroke-neutral-muted
        </text>
      </view>
      <view className="bg-bg-brand-weak rounded-lg p-3">
        <text className="t4-regular text-fg-brand">
          Theme-aware Tailwind brand token
        </text>
      </view>
    </view>
  );
}

export function ThemingPage() {
  const globalProps = getGlobalProps();
  const systemTheme = String(globalProps.theme ?? 'unknown');
  const frontendTheme = String(globalProps.frontendTheme ?? 'unknown');
  const platform = getRuntimePlatform();

  return (
    <scroll-view
      scroll-y
      style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}
    >
      <text
        style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: $color.fg.neutral,
        }}
      >
        Theming
      </text>
      <text style={{ fontSize: '13px', color: $color.fg.neutralSubtle }}>
        Class-based SEED theme tokens for Lynx.
      </text>

      <view
        style={{
          padding: '12px',
          backgroundColor: $color.bg.neutralWeak,
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <text
          style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: $color.fg.neutral,
          }}
        >
          Runtime
        </text>
        <InfoRow label="lynx.__globalProps.theme" value={systemTheme} />
        <InfoRow
          label="lynx.__globalProps.frontendTheme"
          value={frontendTheme}
        />
        <InfoRow label="SystemInfo.platform" value={platform} />
      </view>

      <SectionTitle>getSeedClassName()</SectionTitle>
      <view
        style={{
          padding: '12px',
          borderRadius: '8px',
          borderWidth: '1px',
          borderColor: $color.stroke.neutralMuted,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <InfoRow
          label='colorMode: "system"'
          value={getSafeSeedClassName('system')}
        />
        <InfoRow
          label='colorMode: "light-only"'
          value={getSafeSeedClassName('light-only')}
        />
        <InfoRow
          label='colorMode: "dark-only"'
          value={getSafeSeedClassName('dark-only')}
        />
      </view>

      <SectionTitle>Theme Overrides</SectionTitle>
      <ThemeSurface
        title="Global theme"
        description="No override class. Follows the page theme."
      />
      <ThemeSurface
        title="Light only"
        description="Uses seed-color-mode-light-only on this subtree."
        className="seed-color-mode-light-only"
      />
      <ThemeSurface
        title="Dark only"
        description="Uses seed-color-mode-dark-only on this subtree."
        className="seed-color-mode-dark-only"
      />

      <SectionTitle>Tailwind Tokens</SectionTitle>
      <TailwindTokenPreview />
      <TailwindTokenPreview className="seed-color-mode-dark-only" />
    </scroll-view>
  );
}
