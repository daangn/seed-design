import { IconChevronRightLine } from "@karrotmarket/react-monochrome-icon";
import { LinkContent, SuffixIcon, VStack } from "@seed-design/react";

export default function LinkContentSize() {
  return (
    <VStack>
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
    </VStack>
  );
}
