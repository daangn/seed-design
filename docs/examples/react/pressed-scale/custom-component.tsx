import type { ReactNode } from "react";
import {
  IconBookmarkLine,
  IconChevronRightLine,
  IconClockLine,
  IconDot3HorizontalLine,
} from "@karrotmarket/react-monochrome-icon";
import { HStack, Icon, VStack, usePressScale } from "@seed-design/react";

function PressableCard({ className, children }: { className?: string; children: ReactNode }) {
  const { pressScaleRef, pressScaleClassName } = usePressScale();

  return (
    <button
      type="button"
      ref={pressScaleRef}
      className={`${pressScaleClassName} ${className} flex items-center rounded-r4 border border-stroke-neutral-muted bg-bg-layer-default text-left text-fg-neutral [transition:background-color_0.2s,var(--seed-press-scale-transition)] active:bg-bg-layer-default-pressed active:[scale:var(--seed-press-scale)]`}
    >
      {children}
    </button>
  );
}

export default function PressedScaleCustomComponent() {
  return (
    <VStack gap="x3" className="w-full max-w-80">
      <PressableCard className="w-full gap-x3 p-x3">
        <div className="size-x12 shrink-0 rounded-r3 bg-palette-gray-200" />
        <VStack gap="x0_5" className="min-w-0 flex-1">
          <span className="t5-bold">디자인 시스템 가이드</span>
          <span className="t6-regular text-fg-neutral-muted">아티클 12개</span>
        </VStack>
        <Icon svg={<IconChevronRightLine />} size="x4" color="fg.neutralMuted" />
      </PressableCard>

      <HStack gap="x3">
        <PressableCard className="size-x16 shrink-0 justify-center">
          <Icon svg={<IconBookmarkLine />} size="x5" color="fg.neutral" />
        </PressableCard>
        <PressableCard className="size-x16 shrink-0 justify-center">
          <Icon svg={<IconClockLine />} size="x5" color="fg.neutral" />
        </PressableCard>
        <PressableCard className="size-x16 shrink-0 justify-center">
          <Icon svg={<IconDot3HorizontalLine />} size="x5" color="fg.neutral" />
        </PressableCard>
      </HStack>
    </VStack>
  );
}
