import {
  IconAppleFill,
  IconDiamondFill,
  IconSparkle2Fill,
} from "@karrotmarket/react-monochrome-icon";
import { HStack } from "@seed-design/react";
import { ContentPlaceholder } from "seed-design/ui/content-placeholder";

export default function ContentPlaceholderSvgExample() {
  return (
    <HStack gap="x3">
      <ContentPlaceholder style={{ width: 150, height: 150 }}>
        <IconAppleFill />
      </ContentPlaceholder>
      <ContentPlaceholder style={{ width: 100, height: 150 }}>
        <IconSparkle2Fill />
      </ContentPlaceholder>
      <ContentPlaceholder style={{ width: 200, height: 150 }}>
        <IconDiamondFill />
      </ContentPlaceholder>
    </HStack>
  );
}
