import { useState } from '@lynx-js/react';
import { vars } from '@seed-design/lynx-css/vars';
import { Text, useSafeArea, VStack } from '@seed-design/lynx-react';

interface LynxGlobalProps {
  [key: string]: unknown;
  safeAreaInsetTop?: number | null;
  safeAreaInsetBottom?: number | null;
}

interface LynxGlobal {
  lynx?: {
    __globalProps?: LynxGlobalProps;
  };
}

const { $color } = vars;

function getGlobalProps() {
  return (globalThis as unknown as LynxGlobal).lynx?.__globalProps;
}

function formatValue(value: unknown) {
  if (value == null || value === '') {
    return '-';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

function hasHostSafeAreaValue(value: number | null | undefined) {
  return typeof value === 'number' && value !== 0 && Number.isFinite(value);
}

function getSafeAreaSource(value: number | null | undefined) {
  return hasHostSafeAreaValue(value) ? 'globalProps' : 'env fallback';
}

function addBaseToSafeAreaInset(inset: string, base: number) {
  return `calc(${base}px + ${inset})`;
}

function DebugRow({ label, value }: { label: string; value: unknown }) {
  return (
    <view
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: '12px',
        paddingTop: '10px',
        paddingBottom: '10px',
        borderBottomWidth: '1px',
        borderBottomColor: $color.stroke.neutralMuted,
      }}
    >
      <text style={{ fontSize: '13px', color: $color.fg.neutralSubtle }}>
        {label}
      </text>
      <text
        style={{
          fontSize: '13px',
          fontWeight: 'bold',
          color: $color.fg.neutral,
        }}
      >
        {formatValue(value)}
      </text>
    </view>
  );
}

function SafeAreaPreview({
  title,
  paddingTop,
  paddingBottom,
}: {
  title: string;
  paddingTop: string;
  paddingBottom: string;
}) {
  return (
    <view
      style={{
        background: $color.bg.neutralWeak,
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <view
        style={{
          paddingTop,
          paddingBottom,
          background: $color.bg.brandWeak,
        }}
      >
        <view
          style={{
            padding: '12px',
            background: $color.bg.layerDefault,
            borderRadius: '10px',
          }}
        >
          <text
            style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: $color.fg.brand,
            }}
          >
            {title}
          </text>
          <text
            style={{
              marginTop: '4px',
              fontSize: '13px',
              color: $color.fg.neutralSubtle,
            }}
          >
            top {formatValue(paddingTop)} / bottom {formatValue(paddingBottom)}
          </text>
        </view>
      </view>
    </view>
  );
}

export function SafeAreaDebugPage() {
  const [snapshot, setSnapshot] = useState(0);
  const globalProps = getGlobalProps();
  const globalPropKeys = Object.keys(globalProps ?? {}).join(', ');
  const { safeAreaInsetTop, safeAreaInsetBottom } = useSafeArea();
  const safeAreaPaddingTop = addBaseToSafeAreaInset(safeAreaInsetTop, 16);
  const safeAreaPaddingBottom = addBaseToSafeAreaInset(safeAreaInsetBottom, 16);

  return (
    <VStack gap="x6">
      <VStack gap="x1">
        <Text textStyle="screenTitle">Safe Area Debug</Text>
        <Text textStyle="t5Regular" color="fg.neutralSubtle">
          Verify host-provided safeAreaInsetTop and safeAreaInsetBottom values,
          with env fallback.
        </Text>
        <view
          bindtap={() => setSnapshot((current) => current + 1)}
          style={{
            alignSelf: 'flex-start',
            marginTop: '8px',
            paddingTop: '8px',
            paddingBottom: '8px',
            paddingLeft: '14px',
            paddingRight: '14px',
            background: $color.bg.brandSolid,
            borderRadius: '999px',
          }}
        >
          <text
            style={{
              fontSize: '13px',
              fontWeight: 'bold',
              color: $color.fg.neutralInverted,
            }}
          >
            Refresh raw values #{snapshot}
          </text>
        </view>
      </VStack>

      <VStack gap="x2">
        <Text textStyle="t6Bold">Host globalProps</Text>
        <view
          style={{
            paddingLeft: '14px',
            paddingRight: '14px',
            background: $color.bg.neutralWeak,
            borderRadius: '12px',
          }}
        >
          <DebugRow label="keys" value={globalPropKeys} />
          <DebugRow
            label="safeAreaInsetTop"
            value={globalProps?.safeAreaInsetTop}
          />
          <DebugRow
            label="safeAreaInsetBottom"
            value={globalProps?.safeAreaInsetBottom}
          />
          <DebugRow
            label="top source"
            value={getSafeAreaSource(globalProps?.safeAreaInsetTop)}
          />
          <DebugRow
            label="bottom source"
            value={getSafeAreaSource(globalProps?.safeAreaInsetBottom)}
          />
        </view>
      </VStack>

      <VStack gap="x2">
        <Text textStyle="t6Bold">Resolved values</Text>
        <view
          style={{
            paddingLeft: '14px',
            paddingRight: '14px',
            background: $color.bg.neutralWeak,
            borderRadius: '12px',
          }}
        >
          <DebugRow label="useSafeArea().top" value={safeAreaInsetTop} />
          <DebugRow label="useSafeArea().bottom" value={safeAreaInsetBottom} />
          <DebugRow label="top + 16px base" value={safeAreaPaddingTop} />
          <DebugRow label="bottom + 16px base" value={safeAreaPaddingBottom} />
        </view>
      </VStack>

      <VStack gap="x2">
        <Text textStyle="t6Bold">Preview</Text>
        <SafeAreaPreview
          title="useSafeArea"
          paddingTop={safeAreaInsetTop}
          paddingBottom={safeAreaInsetBottom}
        />
        <SafeAreaPreview
          title="useSafeArea + 16px base"
          paddingTop={safeAreaPaddingTop}
          paddingBottom={safeAreaPaddingBottom}
        />
      </VStack>
    </VStack>
  );
}
