"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { IconDiamond } from "@karrotmarket/react-multicolor-icon";
import { Box, Icon, VStack } from "@seed-design/react";
import { ResultSection, type ResultSectionProps } from "seed-design/ui/result-section";

interface ResultSectionPreviewProps {
  size?: ResultSectionProps["size"];
  title?: string;
  description?: string;
  /** Primary 액션 버튼 라벨 — 비우면 버튼이 사라집니다 */
  primaryActionLabel?: string;
  /** Secondary 액션 버튼 라벨 — 비우면 버튼이 사라집니다 */
  secondaryActionLabel?: string;
}

function ResultSectionPreview({
  size,
  title,
  description,
  primaryActionLabel,
  secondaryActionLabel,
}: ResultSectionPreviewProps) {
  return (
    <VStack minHeight="480px" width="320px" borderWidth={1} borderColor="stroke.neutralMuted">
      <ResultSection
        size={size}
        asset={
          <Box pb="x4">
            <Icon svg={<IconDiamond />} size="x10" />
          </Box>
        }
        title={title}
        description={description}
        {...(primaryActionLabel && {
          primaryActionProps: {
            children: primaryActionLabel,
            onClick: () => window.alert("Primary Action Clicked"),
          },
        })}
        {...(secondaryActionLabel && {
          secondaryActionProps: {
            children: secondaryActionLabel,
            onClick: () => window.alert("Secondary Action Clicked"),
          },
        })}
      />
    </VStack>
  );
}

export const story = defineStory({
  Component: withStoryPreview()(ResultSectionPreview),
  args: {
    initial: {
      title: "결과 타이틀",
      description: "부가 설명을 적어주세요",
      primaryActionLabel: "Primary Action",
      secondaryActionLabel: "Secondary Action",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
