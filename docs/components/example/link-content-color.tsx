import { IconChevronRightLine } from "@daangn/react-monochrome-icon";
import { LinkContent, Stack, SuffixIcon } from "@seed-design/react";

export default function LinkContentColor() {
  return (
    <Stack>
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
    </Stack>
  );
}
