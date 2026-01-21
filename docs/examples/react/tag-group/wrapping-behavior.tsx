import { IconBellFill, IconLocationpinFill } from "@karrotmarket/react-monochrome-icon";
import { Flex, Text, VStack } from "@seed-design/react";
import { TagGroupRoot, TagGroupItem } from "seed-design/ui/tag-group";
import type { PropsWithChildren, ReactNode } from "react";

export default function TagGroupWrappingBehavior() {
  return (
    <Flex
      align="center"
      justify="center"
      grow
      width="full"
      bg="bg.layerBasement"
      borderRadius="r2"
      p="x4"
    >
      <VStack
        gap="x2"
        width="350px"
        maxWidth="max-content"
        overflowX="auto"
        style={{ resize: "horizontal" }}
      >
        <Wrapper title="default (wrap)">
          <TagGroupRoot>
            <TagGroupItem prefixIcon={<IconLocationpinFill />} label="부산광역시 해운대구" />
            <TagGroupItem prefixIcon={<IconBellFill />} label="123 456 789 012 345" />
            <TagGroupItem label="Ut minim laboris enim" />
          </TagGroupRoot>
        </Wrapper>
        <Wrapper title="truncate">
          <TagGroupRoot truncate>
            <TagGroupItem prefixIcon={<IconLocationpinFill />} label="부산광역시 해운대구" />
            <TagGroupItem prefixIcon={<IconBellFill />} label="123 456 789 012 345" />
            <TagGroupItem label="Ut minim laboris enim" />
          </TagGroupRoot>
        </Wrapper>
        <Wrapper title="truncate, keep one fixed">
          <TagGroupRoot truncate>
            <TagGroupItem prefixIcon={<IconLocationpinFill />} label="부산광역시 해운대구" />
            <TagGroupItem
              flexShrink={0}
              prefixIcon={<IconBellFill />}
              label="123 456 789 012 345"
            />
            <TagGroupItem label="Ut minim laboris enim" />
          </TagGroupRoot>
        </Wrapper>
        <Wrapper title="truncate, mixed shrink ratios">
          <TagGroupRoot truncate>
            <TagGroupItem
              prefixIcon={<IconLocationpinFill />}
              flexShrink={1}
              label="부산광역시 해운대구"
            />
            <TagGroupItem
              flexShrink={100}
              prefixIcon={<IconBellFill />}
              label="123 456 789 012 345"
            />
            <TagGroupItem flexShrink={100} label="Ut minim laboris enim" />
          </TagGroupRoot>
        </Wrapper>
      </VStack>
    </Flex>
  );
}

function Wrapper({ title, children }: PropsWithChildren<{ title: ReactNode }>) {
  return (
    <VStack
      align="flex-start"
      justify="center"
      padding="x3"
      bg="bg.layerDefault"
      borderRadius="r2"
      borderWidth={1}
      borderColor="stroke.neutralWeak"
      gap="x1"
      overflowX="hidden"
    >
      <Text textStyle="t2Medium">{title}</Text>
      {children}
    </VStack>
  );
}
