import { Text, useSafeArea, VStack } from "@seed-design/lynx-react";

interface LynxGlobalProps {
  safeAreaInsetTop?: number | null;
  safeAreaInsetBottom?: number | null;
}

function getGlobalProps() {
  return lynx.__globalProps as LynxGlobalProps | undefined;
}

function formatValue(value: unknown) {
  if (value == null || value === "") {
    return "-";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function DebugRow({ label, value }: { label: string; value: unknown }) {
  return (
    <view className="flex flex-row justify-between gap-x3 py-x2_5 border-b border-stroke-neutral-muted">
      <text className="t3-regular text-fg-neutral-subtle">{label}</text>
      <text className="t3-bold text-fg-neutral">{formatValue(value)}</text>
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
    <view className="bg-bg-neutral-weak rounded-r3 overflow-hidden">
      <view
        className="bg-bg-brand-weak"
        style={{
          paddingTop,
          paddingBottom,
        }}
      >
        <view className="p-x3 bg-bg-layer-default rounded-r2_5">
          <text className="t4-bold text-fg-brand">{title}</text>
          <text className="t3-regular text-fg-neutral-subtle mt-x1">
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
        <view className="px-x3_5 bg-bg-neutral-weak rounded-r3">
          <DebugRow label="safeAreaInsetTop" value={globalProps?.safeAreaInsetTop} />
          <DebugRow label="safeAreaInsetBottom" value={globalProps?.safeAreaInsetBottom} />
        </view>
      </VStack>

      <VStack gap="x2">
        <Text textStyle="t6Bold">Resolved values</Text>
        <view className="px-x3_5 bg-bg-neutral-weak rounded-r3">
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
