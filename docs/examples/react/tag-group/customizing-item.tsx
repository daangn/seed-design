import {
  IconCheckmarkCircleFill,
  IconHeartFill,
  IconHorizline2VerticalChatbubbleRectangularRightFill,
  IconStarFill,
} from "@karrotmarket/react-monochrome-icon";
import { Icon, VStack } from "@seed-design/react";
import { TagGroupRoot, TagGroupItem } from "seed-design/ui/tag-group";
import { TagGroup as SeedTagGroup } from "@seed-design/react";

export default function TagGroupCustomizingItem() {
  return (
    <VStack gap="spacingY.componentDefault" align="center">
      <TagGroupRoot>
        {/* You can use the compound components to customize the items */}
        <SeedTagGroup.Item weight="bold" tone="neutral" aria-label="평점 4.5">
          <Icon svg={<IconStarFill />} color="fg.brand" />
          <SeedTagGroup.ItemLabel>4.5</SeedTagGroup.ItemLabel>
        </SeedTagGroup.Item>
        <TagGroupItem label="후기 37" />
        <TagGroupItem label="단골 12" />
      </TagGroupRoot>
      <TagGroupRoot tone="neutral">
        <TagGroupItem tone="brand" suffixIcon={<IconCheckmarkCircleFill />} label="인증됨" />
        <TagGroupItem aria-label="관심 10개" prefixIcon={<IconHeartFill />} label="10" />
        <TagGroupItem
          aria-label="댓글 3개"
          prefixIcon={<IconHorizline2VerticalChatbubbleRectangularRightFill />}
          label="3"
        />
      </TagGroupRoot>
    </VStack>
  );
}
