import { IconChevronRightLine } from "@daangn/react-monochrome-icon";
import { LinkWithIcon, SuffixIcon } from "@seed-design/react";

export default function LinkWithIconPreview() {
  return (
    <LinkWithIcon>
      새 글
      <SuffixIcon svg={<IconChevronRightLine />} />
    </LinkWithIcon>
  );
}
