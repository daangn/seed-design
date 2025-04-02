import { IconChevronRightLine } from "@karrotmarket/react-monochrome-icon";
import { LinkContent, SuffixIcon } from "@seed-design/react";

export default function LinkContentPreview() {
  return (
    <LinkContent>
      새 글
      <SuffixIcon svg={<IconChevronRightLine />} />
    </LinkContent>
  );
}
