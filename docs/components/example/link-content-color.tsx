import { IconChevronRightLine } from "@karrotmarket/react-monochrome-icon";
import { LinkContent, VStack, SuffixIcon } from "@seed-design/react";

export default function LinkContentColor() {
  return (
    <VStack>
      <LinkContent color="fg.neutral">
        더보기
        <SuffixIcon svg={<IconChevronRightLine />} />
      </LinkContent>
      <LinkContent color="fg.neutralSubtle">
        더보기
        <SuffixIcon svg={<IconChevronRightLine />} />
      </LinkContent>
      <LinkContent color="fg.brand">
        더보기
        <SuffixIcon svg={<IconChevronRightLine />} />
      </LinkContent>
      <LinkContent color="fg.informative">
        더보기
        <SuffixIcon svg={<IconChevronRightLine />} />
      </LinkContent>
    </VStack>
  );
}
