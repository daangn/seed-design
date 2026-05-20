import { useState } from '@lynx-js/react';
import { vars } from '@seed-design/lynx-css/vars';
import {
  getSafeAreaInset,
  getSafeAreaPadding,
  Text,
  useSafeArea,
  VStack,
} from '@seed-design/lynx-react';

interface LynxGlobalProps {
  [key: string]: unknown;
  safeAreaInsets?: {
    top?: number | string | null;
    bottom?: number | string | null;
  };
  safeAreaInsetTop?: number | string | null;
  safeAreaInsetBottom?: number | string | null;
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
            top {paddingTop} / bottom {paddingBottom}
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
  const helperTop = getSafeAreaInset('top');
  const helperBottom = getSafeAreaInset('bottom');
  const helperPaddingTop = getSafeAreaPadding('top', 16);
  const helperPaddingBottom = getSafeAreaPadding('bottom', 16);
  const { safeAreaInsetTop, safeAreaInsetBottom } = useSafeArea();

  return (
    <VStack gap="x6">
      <VStack gap="x1">
        <Text textStyle="screenTitle">Safe Area Debug</Text>
        <Text textStyle="t5Regular" color="fg.neutralSubtle">
          Compare raw globalProps, env fallback, and package helper output.
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
        <Text textStyle="t6Bold">globalProps</Text>
        <view
          style={{
            paddingLeft: '14px',
            paddingRight: '14px',
            background: $color.bg.neutralWeak,
            borderRadius: '12px',
          }}
        >
          <DebugRow label="keys" value={globalPropKeys} />
          <DebugRow label="raw" value={globalProps} />
          <DebugRow label="safearea" value={globalProps?.safearea} />
          <DebugRow label="safeArea" value={globalProps?.safeArea} />
          <DebugRow label="safeAreaInsets" value={globalProps?.safeAreaInsets} />
          <DebugRow
            label="safeAreaInsets.top"
            value={globalProps?.safeAreaInsets?.top}
          />
          <DebugRow
            label="safeAreaInsets.bottom"
            value={globalProps?.safeAreaInsets?.bottom}
          />
          <DebugRow
            label="safeAreaInsetTop"
            value={globalProps?.safeAreaInsetTop}
          />
          <DebugRow
            label="safeAreaInsetBottom"
            value={globalProps?.safeAreaInsetBottom}
          />
        </view>
      </VStack>

      <VStack gap="x2">
        <Text textStyle="t6Bold">Package helper</Text>
        <view
          style={{
            paddingLeft: '14px',
            paddingRight: '14px',
            background: $color.bg.neutralWeak,
            borderRadius: '12px',
          }}
        >
          <DebugRow label="getSafeAreaInset(top)" value={helperTop} />
          <DebugRow label="getSafeAreaInset(bottom)" value={helperBottom} />
          <DebugRow
            label="getSafeAreaPadding(top, 16)"
            value={helperPaddingTop}
          />
          <DebugRow
            label="getSafeAreaPadding(bottom, 16)"
            value={helperPaddingBottom}
          />
          <DebugRow label="useSafeArea().top" value={safeAreaInsetTop} />
          <DebugRow label="useSafeArea().bottom" value={safeAreaInsetBottom} />
        </view>
      </VStack>

      <VStack gap="x2">
        <Text textStyle="t6Bold">Visual comparison</Text>
        <SafeAreaPreview
          title="env only"
          paddingTop="env(safe-area-inset-top)"
          paddingBottom="env(safe-area-inset-bottom)"
        />
        <SafeAreaPreview
          title="package helper"
          paddingTop={helperTop}
          paddingBottom={helperBottom}
        />
        <SafeAreaPreview
          title="package helper + 16px base"
          paddingTop={helperPaddingTop}
          paddingBottom={helperPaddingBottom}
        />
      </VStack>
    </VStack>
  );
}
