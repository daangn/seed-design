import { IconChevronRightLine } from "@karrotmarket/react-monochrome-icon";
import { LinkContent, SuffixIcon } from "@ride-developer/react";

export default function LinkContentPreview() {
  return (
    <LinkContent>
      새 글
      <SuffixIcon svg={<IconChevronRightLine />} />
    </LinkContent>
  );
}
