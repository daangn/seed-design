import {
  IconCheckmarkCircleFill,
  IconHeartFill,
  IconHorizline2VerticalChatbubbleRectangularRightFill,
  IconStarFill,
} from "@karrotmarket/react-monochrome-icon";
import { Icon, SuffixIcon, TagGroup, VStack } from "@seed-design/react";

export default function TagGroupCustomizingItem() {
  return (
    <VStack gap="spacingY.componentDefault" align="center">
      <TagGroup.Root>
        <TagGroup.Item weight="bold" tone="neutral" aria-label="평점 4.5">
          <Icon svg={<IconStarFill />} color="fg.brand" />
          4.5
        </TagGroup.Item>
        <TagGroup.Item>후기 37</TagGroup.Item>
        <TagGroup.Item>단골 12</TagGroup.Item>
      </TagGroup.Root>
      <TagGroup.Root tone="neutral">
        <TagGroup.Item tone="brand">
          인증됨
          <SuffixIcon svg={<IconCheckmarkCircleFill />} />
        </TagGroup.Item>
        <TagGroup.Item aria-label="관심 10개">
          <Icon svg={<IconHeartFill />} />
          10
        </TagGroup.Item>
        <TagGroup.Item aria-label="댓글 3개">
          <Icon svg={<IconHorizline2VerticalChatbubbleRectangularRightFill />} />3
        </TagGroup.Item>
      </TagGroup.Root>
    </VStack>
  );
}
