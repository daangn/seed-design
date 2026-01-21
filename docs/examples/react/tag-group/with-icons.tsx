import { IconLocationpinFill, IconMegaphoneFill } from "@karrotmarket/react-monochrome-icon";
import { VStack } from "@seed-design/react";
import { TagGroupRoot, TagGroupItem } from "seed-design/ui/tag-group";

export default function TagGroupWithIcons() {
  return (
    <VStack gap="spacingY.componentDefault" align="center">
      <TagGroupRoot>
        <TagGroupItem label="광고" suffixIcon={<IconMegaphoneFill />} />
        <TagGroupItem label="끌올 3시간 전" />
        <TagGroupItem label="서초4동" />
      </TagGroupRoot>
      <TagGroupRoot>
        <TagGroupItem prefixIcon={<IconLocationpinFill />} label="서초4동" />
        <TagGroupItem label="인증 5회" />
        <TagGroupItem label="3분 전" />
      </TagGroupRoot>
    </VStack>
  );
}
