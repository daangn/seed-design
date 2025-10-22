import { IconLocationpinFill, IconMegaphoneFill } from "@karrotmarket/react-monochrome-icon";
import { PrefixIcon, SuffixIcon, TagGroup, VStack } from "@seed-design/react";

export default function TagGroupTones() {
  return (
    <VStack gap="spacingY.componentDefault" align="center">
      <TagGroup.Root>
        <TagGroup.Item>
          광고
          <SuffixIcon svg={<IconMegaphoneFill />} />
        </TagGroup.Item>
        <TagGroup.Item>끌올 3시간 전</TagGroup.Item>
        <TagGroup.Item>서초4동</TagGroup.Item>
      </TagGroup.Root>
      <TagGroup.Root>
        <TagGroup.Item>
          <PrefixIcon svg={<IconLocationpinFill />} />
          서초4동
        </TagGroup.Item>
        <TagGroup.Item>인증 5회</TagGroup.Item>
        <TagGroup.Item>3분 전</TagGroup.Item>
      </TagGroup.Root>
    </VStack>
  );
}
