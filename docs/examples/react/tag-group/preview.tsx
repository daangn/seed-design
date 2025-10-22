import { IconLocationpinFill } from "@karrotmarket/react-monochrome-icon";
import { PrefixIcon, TagGroup } from "@seed-design/react";

export default function TagGroupPreview() {
  return (
    <TagGroup.Root>
      <TagGroup.Item>
        <PrefixIcon svg={<IconLocationpinFill />} />
        500m
      </TagGroup.Item>
      <TagGroup.Item>서초4동</TagGroup.Item>
      <TagGroup.Item>3분 전</TagGroup.Item>
    </TagGroup.Root>
  );
}
