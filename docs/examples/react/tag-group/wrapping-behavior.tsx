import { IconLocationpinFill } from "@karrotmarket/react-monochrome-icon";
import { Flex, PrefixIcon, TagGroup } from "@seed-design/react";

export default function TagGroupWrappingBehavior() {
  return (
    <Flex align="center" justify="center" grow width="full" bg="bg.layerBasement" borderRadius="r2">
      <Flex
        align="center"
        justify="center"
        padding="x3"
        bg="bg.layerDefault"
        borderRadius="r2"
        borderWidth={1}
        borderColor="stroke.neutralWeak"
        style={{ resize: "horizontal", overflow: "auto", maxWidth: "max-content" }}
      >
        <TagGroup.Root size="t4">
          <TagGroup.Item>
            <PrefixIcon svg={<IconLocationpinFill />} />
            500m
          </TagGroup.Item>
          <TagGroup.Item>서초4동</TagGroup.Item>
          <TagGroup.Item>3분 전</TagGroup.Item>
        </TagGroup.Root>
      </Flex>
    </Flex>
  );
}
