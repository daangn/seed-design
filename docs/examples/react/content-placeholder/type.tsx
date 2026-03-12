import { Flex } from "@seed-design/react";
import { ContentPlaceholder } from "seed-design/ui/content-placeholder";

export default function ContentPlaceholderTypeExample() {
  return (
    <Flex gap="x3">
      <ContentPlaceholder type="default" style={{ width: 80, height: 80 }} />
      <ContentPlaceholder type="image" style={{ width: 80, height: 80 }} />
      <ContentPlaceholder type="car" style={{ width: 80, height: 80 }} />
    </Flex>
  );
}
