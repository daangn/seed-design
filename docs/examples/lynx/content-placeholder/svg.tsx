import IconAppleFill from "@karrotmarket/lynx-monochrome-icon/IconAppleFill";
import IconSparkle2Fill from "@karrotmarket/lynx-monochrome-icon/IconSparkle2Fill";
import IconDiamondFill from "@karrotmarket/lynx-monochrome-icon/IconDiamondFill";
import { HStack } from "@seed-design/lynx-react";
import { ContentPlaceholder } from "@/components/ui/content-placeholder";

export default function ContentPlaceholderSvgExample() {
  return (
    <HStack gap="x3" wrap="wrap">
      <ContentPlaceholder width="150px" height="150px">
        <IconAppleFill tint-color="#ff6600" />
      </ContentPlaceholder>
      <ContentPlaceholder width="100px" height="150px">
        <IconSparkle2Fill tint-color="#ff6600" />
      </ContentPlaceholder>
      <ContentPlaceholder width="200px" height="150px">
        <IconDiamondFill tint-color="#ff6600" />
      </ContentPlaceholder>
    </HStack>
  );
}
