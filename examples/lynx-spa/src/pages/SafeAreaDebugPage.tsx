import {
  ActionButton,
  Box,
  DialogBackdrop,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  Text,
  useSafeArea,
  useSeedContext,
  VStack,
} from "@seed-design/lynx-react";

import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "../seed-design/ui/bottom-sheet";

interface LynxGlobalProps {
  safeAreaInsetTop?: number | null;
  safeAreaInsetBottom?: number | null;
  windowSafeAreaInsetTop?: number | null;
  windowSafeAreaInsetBottom?: number | null;
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

/** `container="window"` 레이어는 `windowSafeAreaInsets`로 여백을 정한다. */
function WindowOverlayExamples() {
  return (
    <view className="flex flex-row gap-x2">
      <BottomSheetRoot>
        <BottomSheetTrigger>
          <ActionButton variant="neutralWeak">Window sheet</ActionButton>
        </BottomSheetTrigger>
        <BottomSheetContent container="window" title="Window sheet">
          <BottomSheetBody>
            <text className="t4-regular text-fg-neutral">
              The bottom padding follows windowSafeAreaInsets.
            </text>
          </BottomSheetBody>
        </BottomSheetContent>
      </BottomSheetRoot>
      <DialogRoot>
        <DialogTrigger>
          <ActionButton variant="neutralWeak">Window dialog</ActionButton>
        </DialogTrigger>
        <DialogPositioner container="window">
          <DialogBackdrop />
          <DialogContent>
            <DialogTitle>Window dialog</DialogTitle>
            <DialogDescription>The padding follows windowSafeAreaInsets.</DialogDescription>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
    </view>
  );
}

export function SafeAreaDebugPage() {
  const globalProps = getGlobalProps();
  const { safeAreaInsetTop, safeAreaInsetBottom } = useSafeArea();
  const { windowSafeAreaInsets } = useSeedContext();

  return (
    <VStack gap="x6">
      <VStack gap="x1">
        <Text textStyle="screenTitle">Safe Area Debug</Text>
        <Text textStyle="t5Regular" color="fg.neutralSubtle">
          Verify safeAreaInsetTop/Bottom and windowSafeAreaInsetTop/Bottom.
        </Text>
      </VStack>

      <VStack gap="x2">
        <Text textStyle="t6Bold">Host globalProps</Text>
        <view className="px-x3_5 bg-bg-neutral-weak rounded-r3">
          <DebugRow label="safeAreaInsetTop" value={globalProps?.safeAreaInsetTop} />
          <DebugRow label="safeAreaInsetBottom" value={globalProps?.safeAreaInsetBottom} />
          <DebugRow label="windowSafeAreaInsetTop" value={globalProps?.windowSafeAreaInsetTop} />
          <DebugRow
            label="windowSafeAreaInsetBottom"
            value={globalProps?.windowSafeAreaInsetBottom}
          />
        </view>
      </VStack>

      <VStack gap="x2">
        <Text textStyle="t6Bold">Resolved values</Text>
        <view className="px-x3_5 bg-bg-neutral-weak rounded-r3">
          <DebugRow label="useSafeArea().top" value={safeAreaInsetTop} />
          <DebugRow label="useSafeArea().bottom" value={safeAreaInsetBottom} />
          <DebugRow label="windowSafeAreaInsets.top" value={windowSafeAreaInsets?.top} />
          <DebugRow label="windowSafeAreaInsets.bottom" value={windowSafeAreaInsets?.bottom} />
        </view>
      </VStack>

      <VStack gap="x2">
        <Text textStyle="t6Bold">Preview</Text>
        <SafeAreaPreview
          title="useSafeArea"
          paddingTop={safeAreaInsetTop}
          paddingBottom={safeAreaInsetBottom}
        />
        <view className="bg-bg-neutral-weak rounded-r3 overflow-hidden">
          <Box bg="bg.brandWeak" pt="safeArea" pb="safeArea">
            <view className="p-x3 bg-bg-layer-default rounded-r2_5">
              <text className="t4-bold text-fg-brand">{'Box pt="safeArea" pb="safeArea"'}</text>
            </view>
          </Box>
        </view>
      </VStack>

      <VStack gap="x2">
        <Text textStyle="t6Bold">Window overlay</Text>
        <WindowOverlayExamples />
      </VStack>
    </VStack>
  );
}
