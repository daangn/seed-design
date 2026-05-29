import { useState } from "@lynx-js/react";
import { vars } from "@seed-design/lynx-css/vars";
import { Box, HStack, Text, VStack } from "@seed-design/lynx-react";

import { PerformancePanel } from "../components/performance-panel.jsx";

const STRESS_ITEMS = Array.from({ length: 72 }, (_, index) => index);
const STRESS_TILE_SIZE = "56px";

const TAILWIND_TONES = [
  {
    tile: "bg-bg-brand-weak",
    text: "text-fg-brand",
  },
  {
    tile: "bg-bg-positive-weak",
    text: "text-fg-positive",
  },
  {
    tile: "bg-bg-informative-weak",
    text: "text-fg-informative",
  },
  {
    tile: "bg-bg-neutral-weak",
    text: "text-fg-neutral",
  },
] as const;

const STYLE_TONES = [
  {
    tile: vars.$color.bg.brandWeak,
    text: vars.$color.fg.brand,
  },
  {
    tile: vars.$color.bg.positiveWeak,
    text: vars.$color.fg.positive,
  },
  {
    tile: vars.$color.bg.informativeWeak,
    text: vars.$color.fg.informative,
  },
  {
    tile: vars.$color.bg.neutralWeak,
    text: vars.$color.fg.neutral,
  },
] as const;

const SEED_TONES = [
  {
    tile: "bg.brandWeak",
    text: "fg.brand",
  },
  {
    tile: "bg.positiveWeak",
    text: "fg.positive",
  },
  {
    tile: "bg.informativeWeak",
    text: "fg.informative",
  },
  {
    tile: "bg.neutralWeak",
    text: "fg.neutral",
  },
] as const;

const STRESS_IDENTIFIERS = {
  tailwind: "layout-stress:tailwind",
  style: "layout-stress:inline-style",
  seed: "layout-stress:seed-primitives",
} as const;

function useStressRevision() {
  const [revision, setRevision] = useState(0);

  return {
    revision,
    rerender: () => {
      "background only";
      setRevision((current) => current + 1);
    },
  };
}

function getTimingFlag(identifier: string, revision: number) {
  return `${identifier}:${revision}`;
}

function NativeHeader({ title, description }: { title: string; description: string }) {
  return (
    <view
      style={{
        display: "flex",
        flexDirection: "column",
        gap: vars.$dimension.x1,
      }}
    >
      <text
        style={{
          color: vars.$color.fg.neutral,
          fontSize: vars.$fontSize.t9,
          lineHeight: vars.$lineHeight.t9,
          fontWeight: "700",
        }}
      >
        {title}
      </text>
      <text
        style={{
          color: vars.$color.fg.neutralSubtle,
          fontSize: vars.$fontSize.t4,
          lineHeight: vars.$lineHeight.t4,
          fontWeight: "400",
        }}
      >
        {description}
      </text>
    </view>
  );
}

export function LayoutStressTailwindPage() {
  const { revision, rerender } = useStressRevision();

  return (
    <view className="flex flex-col gap-4">
      <PerformancePanel
        identifier={STRESS_IDENTIFIERS.tailwind}
        revision={revision}
        onRerender={rerender}
      />

      <view
        __lynx_timing_flag={getTimingFlag(STRESS_IDENTIFIERS.tailwind, revision)}
        className="flex flex-col gap-4"
      >
        <view className="flex flex-col gap-1">
          <text className="t9-bold text-fg-neutral">Stress: Tailwind</text>
          <text className="t4-regular text-fg-neutral-subtle">
            72 tiles rendered with Tailwind utilities.
          </text>
        </view>

        <view className="flex flex-row flex-wrap gap-2">
          {STRESS_ITEMS.map((item) => {
            const tone = TAILWIND_TONES[(item + revision) % TAILWIND_TONES.length];

            return (
              <view
                key={item}
                className={`${tone.tile} flex flex-col items-center justify-center gap-0.5 rounded-lg p-2`}
                style={{ width: STRESS_TILE_SIZE, height: STRESS_TILE_SIZE }}
              >
                <text className={`t2-bold ${tone.text}`}>{`#${item + 1}`}</text>
                <text className="t1-regular text-fg-neutral-subtle">item</text>
              </view>
            );
          })}
        </view>
      </view>
    </view>
  );
}

export function LayoutStressStylePage() {
  const { revision, rerender } = useStressRevision();

  return (
    <view
      style={{
        display: "flex",
        flexDirection: "column",
        gap: vars.$dimension.x4,
      }}
    >
      <PerformancePanel
        identifier={STRESS_IDENTIFIERS.style}
        revision={revision}
        onRerender={rerender}
      />

      <view __lynx_timing_flag={getTimingFlag(STRESS_IDENTIFIERS.style, revision)}>
        <view
          style={{
            display: "flex",
            flexDirection: "column",
            gap: vars.$dimension.x4,
          }}
        >
          <NativeHeader
            title="Stress: inline style"
            description="72 tiles rendered with native tags and explicit object styles."
          />

          <view
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: vars.$dimension.x2,
            }}
          >
            {STRESS_ITEMS.map((item) => {
              const tone = STYLE_TONES[(item + revision) % STYLE_TONES.length];

              return (
                <view
                  key={item}
                  style={{
                    background: tone.tile,
                    borderRadius: vars.$radius.r2,
                    width: STRESS_TILE_SIZE,
                    height: STRESS_TILE_SIZE,
                    padding: vars.$dimension.x2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: vars.$dimension.x0_5,
                  }}
                >
                  <text
                    style={{
                      color: tone.text,
                      fontSize: vars.$fontSize.t2,
                      lineHeight: vars.$lineHeight.t2,
                      fontWeight: "700",
                    }}
                  >
                    {`#${item + 1}`}
                  </text>
                  <text
                    style={{
                      color: vars.$color.fg.neutralSubtle,
                      fontSize: vars.$fontSize.t1,
                      lineHeight: vars.$lineHeight.t1,
                      fontWeight: "400",
                    }}
                  >
                    item
                  </text>
                </view>
              );
            })}
          </view>
        </view>
      </view>
    </view>
  );
}

export function LayoutStressSeedPrimitivesPage() {
  const { revision, rerender } = useStressRevision();

  return (
    <view
      style={{
        display: "flex",
        flexDirection: "column",
        gap: vars.$dimension.x4,
      }}
    >
      <PerformancePanel
        identifier={STRESS_IDENTIFIERS.seed}
        revision={revision}
        onRerender={rerender}
      />

      <view __lynx_timing_flag={getTimingFlag(STRESS_IDENTIFIERS.seed, revision)}>
        <VStack gap="x4">
          <VStack gap="x1">
            <Text textStyle="t9Bold" color="fg.neutral">
              Stress: SEED primitives
            </Text>
            <Text textStyle="t4Regular" color="fg.neutralSubtle">
              72 tiles rendered with Box, VStack, HStack, and Text.
            </Text>
          </VStack>

          <HStack gap="x2" wrap>
            {STRESS_ITEMS.map((item) => {
              const tone = SEED_TONES[(item + revision) % SEED_TONES.length];

              return (
                <Box
                  key={item}
                  bg={tone.tile}
                  borderRadius="r2"
                  width={STRESS_TILE_SIZE}
                  height={STRESS_TILE_SIZE}
                  p="x2"
                >
                  <VStack gap="x0_5" align="center" justify="center" style={{ height: "100%" }}>
                    <Text textStyle="t2Bold" color={tone.text}>
                      {`#${item + 1}`}
                    </Text>
                    <Text textStyle="t1Regular" color="fg.neutralSubtle">
                      item
                    </Text>
                  </VStack>
                </Box>
              );
            })}
          </HStack>
        </VStack>
      </view>
    </view>
  );
}
