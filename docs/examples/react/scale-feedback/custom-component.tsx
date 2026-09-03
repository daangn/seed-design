import type { ComponentPropsWithoutRef } from "react";
import {
  IconBookmarkLine,
  IconChevronRightLine,
  IconClockLine,
  IconDot3HorizontalLine,
} from "@karrotmarket/react-monochrome-icon";
import { HStack, Icon, ScaleFeedback, VStack } from "@seed-design/react";
import { clsx } from "cn";

function PressableCard({ className, ...props }: ComponentPropsWithoutRef<"button">) {
  return (
    <ScaleFeedback>
      <button
        type="button"
        className={clsx(
          "flex items-center rounded-r4 border border-stroke-neutral-muted bg-bg-layer-default text-left text-fg-neutral [transition:background-color_0.2s,var(--seed-feedback-scale-transition)] active:bg-bg-layer-default-pressed active:scale-(--seed-feedback-scale)",
          className,
        )}
        {...props}
      />
    </ScaleFeedback>
  );
}

export default function ScaleFeedbackCustomComponent() {
  return (
    <VStack gap="x3" className="w-full max-w-80">
      <PressableCard className="w-full gap-x3 p-x3">
        <div className="size-x12 shrink-0 rounded-r3 bg-palette-gray-200" />
        <VStack gap="x0_5" className="min-w-0 flex-1">
          <span className="t6-bold">Ad anim deserunt</span>
          <span className="t4-regular text-fg-neutral-muted">
            Consequat ea commodo nisi eiusmod ex et est.
          </span>
        </VStack>
        <Icon svg={<IconChevronRightLine />} size="x4" color="fg.neutralMuted" />
      </PressableCard>

      <HStack gap="x3">
        <PressableCard className="h-x16 flex-1 justify-center" aria-label="저장">
          <Icon svg={<IconBookmarkLine />} size="x5" color="fg.neutral" />
        </PressableCard>
        <PressableCard className="h-x16 flex-1 justify-center" aria-label="최근">
          <Icon svg={<IconClockLine />} size="x5" color="fg.neutral" />
        </PressableCard>
        <PressableCard className="h-x16 flex-1 justify-center" aria-label="더보기">
          <Icon svg={<IconDot3HorizontalLine />} size="x5" color="fg.neutral" />
        </PressableCard>
      </HStack>
    </VStack>
  );
}
