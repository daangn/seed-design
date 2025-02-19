import { IconChevronRightLine } from "@daangn/react-monochrome-icon";
import { LinkWithIcon, Stack, SuffixIcon } from "@seed-design/react";

export default function LinkWithIconColor() {
  return (
    <Stack>
      <LinkWithIcon color="fg.neutral">
        더보기
        <SuffixIcon svg={<IconChevronRightLine />} />
      </LinkWithIcon>
      <LinkWithIcon color="fg.neutralSubtle">
        더보기
        <SuffixIcon svg={<IconChevronRightLine />} />
      </LinkWithIcon>
      <LinkWithIcon color="fg.brand">
        더보기
        <SuffixIcon svg={<IconChevronRightLine />} />
      </LinkWithIcon>
      <LinkWithIcon color="fg.informative">
        더보기
        <SuffixIcon svg={<IconChevronRightLine />} />
      </LinkWithIcon>
    </Stack>
  );
}
