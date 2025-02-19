import { IconChevronRightLine } from "@daangn/react-monochrome-icon";
import { LinkWithIcon, Stack, SuffixIcon } from "@seed-design/react";

export default function LinkWithIconSize() {
  return (
    <Stack>
      <LinkWithIcon size="t4">
        추가
        <SuffixIcon svg={<IconChevronRightLine />} />
      </LinkWithIcon>
      <LinkWithIcon size="t5">
        추가
        <SuffixIcon svg={<IconChevronRightLine />} />
      </LinkWithIcon>
      <LinkWithIcon size="t6">
        추가
        <SuffixIcon svg={<IconChevronRightLine />} />
      </LinkWithIcon>
    </Stack>
  );
}
