import { IconChevronRightLine } from "@daangn/react-monochrome-icon";
import { LinkContent, Stack, SuffixIcon } from "@seed-design/react";

export default function LinkContentSize() {
  return (
    <Stack>
      <LinkContent size="t4">
        추가
        <SuffixIcon svg={<IconChevronRightLine />} />
      </LinkContent>
      <LinkContent size="t5">
        추가
        <SuffixIcon svg={<IconChevronRightLine />} />
      </LinkContent>
      <LinkContent size="t6">
        추가
        <SuffixIcon svg={<IconChevronRightLine />} />
      </LinkContent>
    </Stack>
  );
}
