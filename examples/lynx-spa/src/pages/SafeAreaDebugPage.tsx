import { vars } from '@seed-design/lynx-css/vars';
import { Text, useSafeArea, VStack } from '@seed-design/lynx-react';

interface LynxGlobalProps {
  safeAreaInsetTop?: number | null;
  safeAreaInsetBottom?: number | null;
}

const { $color } = vars;

function getGlobalProps() {
  return lynx.__globalProps as LynxGlobalProps | undefined;
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
      <text style={{ fontSize: '13px', color: $color.fg.neutralSubtle }}>{label}</text>
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
  const globalProps = getGlobalProps();
  const { safeAreaInsetTop, safeAreaInsetBottom } = useSafeArea();

  return (
    <VStack gap="x6">
      <VStack gap="x1">
        <Text textStyle="screenTitle">Safe Area Debug</Text>
        <Text textStyle="t5Regular" color="fg.neutralSubtle">
          Verify safeAreaInsetTop and safeAreaInsetBottom.
        </Text>
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
          <DebugRow label="safeAreaInsetTop" value={globalProps?.safeAreaInsetTop} />
          <DebugRow label="safeAreaInsetBottom" value={globalProps?.safeAreaInsetBottom} />
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
        </view>
      </VStack>

      <VStack gap="x2">
        <Text textStyle="t6Bold">Preview</Text>
        <SafeAreaPreview
          title="useSafeArea"
          paddingTop={safeAreaInsetTop}
          paddingBottom={safeAreaInsetBottom}
        />
      </VStack>
    </VStack>
  );
}
