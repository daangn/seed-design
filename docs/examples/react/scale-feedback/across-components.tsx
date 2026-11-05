"use client";

import { IconArrowUpBracketDownLine, IconBookmarkLine } from "@karrotmarket/react-monochrome-icon";
import { HStack, Icon, Text, VStack } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { Checkbox } from "seed-design/ui/checkbox";
import { Chip } from "seed-design/ui/chip";
import { QuantityPicker } from "seed-design/ui/quantity-picker";
import { TagGroupItem, TagGroupRoot } from "seed-design/ui/tag-group";

const SHOWTIMES = ["19:40", "21:50", "23:30"];

const PRICE_PER_TICKET = 12000;

export default function ScaleFeedbackAcrossComponents() {
  const [tickets, setTickets] = useState(2);

  return (
    <div className="w-full max-w-[375px] overflow-hidden rounded-r4 border border-stroke-neutral-muted bg-bg-layer-default">
      <HStack gap="x4" padding="x6" align="flex-start" justify="space-between">
        <VStack gap="x1">
          <TagGroupRoot size="t2" weight="bold" tone="neutralSubtle">
            <TagGroupItem label="심야 상영" />
            <TagGroupItem label="3관" />
          </TagGroupRoot>
          <Text textStyle="t9Bold" color="fg.neutral">
            파도의 뒷면
          </Text>
          <TagGroupRoot size="t3" weight="regular" tone="neutralSubtle">
            <TagGroupItem label="98분" />
            <TagGroupItem label="12세 이상 관람가" />
          </TagGroupRoot>
        </VStack>
        <HStack gap="x1">
          <ActionButton size="xsmall" layout="iconOnly" variant="neutralWeak" aria-label="저장">
            <Icon svg={<IconBookmarkLine />} />
          </ActionButton>
          <ActionButton size="xsmall" layout="iconOnly" variant="neutralWeak" aria-label="공유">
            <Icon svg={<IconArrowUpBracketDownLine />} />
          </ActionButton>
        </HStack>
      </HStack>

      <div className="border-t border-dashed border-stroke-neutral-muted" />

      <VStack gap="x6" padding="x6">
        <VStack gap="x3">
          <Text textStyle="t5Medium" color="fg.neutral">
            회차
          </Text>
          <Chip.RadioRoot defaultValue="21:50" aria-label="회차">
            <HStack gap="x2">
              {SHOWTIMES.map((time) => (
                <Chip.RadioItem key={time} value={time} size="large" variant="outlineStrong">
                  <Chip.Label>{time}</Chip.Label>
                </Chip.RadioItem>
              ))}
            </HStack>
          </Chip.RadioRoot>
        </VStack>

        <HStack align="center" justify="space-between">
          <Text textStyle="t5Medium" color="fg.neutral">
            인원
          </Text>
          <QuantityPicker
            size="small"
            min={1}
            max={99}
            value={tickets}
            onValueChange={setTickets}
            aria-label="예매 인원"
          />
        </HStack>

        <Checkbox size="large" tone="neutral" label="취소 규정을 확인했어요" />
      </VStack>

      <div className="border-t border-stroke-neutral-muted p-x6">
        <ActionButton size="large" variant="neutralSolid" className="w-full">
          {tickets}매 예매하기 · {(tickets * PRICE_PER_TICKET).toLocaleString()}원
        </ActionButton>
      </div>
    </div>
  );
}
