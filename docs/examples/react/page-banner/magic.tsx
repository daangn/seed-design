import { IconSparkle2 } from "@karrotmarket/react-multicolor-icon";
import { VStack } from "@seed-design/react";
import {
  ActionablePageBanner,
  DismissiblePageBanner,
  PageBanner,
  PageBannerButton,
} from "seed-design/ui/page-banner";

export default function PageBannerMagic() {
  return (
    <VStack gap="x4" width="full">
      <PageBanner
        tone="magic"
        variant="weak"
        prefixIcon={<IconSparkle2 />}
        title="새로운 기능"
        description="마법 같은 소식이 도착했어요!"
        suffix={<PageBannerButton>둘러보기</PageBannerButton>}
      />
      <ActionablePageBanner
        tone="magic"
        variant="weak"
        prefixIcon={<IconSparkle2 />}
        title="새로운 기능"
        description="마법 같은 소식이 도착했어요!"
      />
      <DismissiblePageBanner
        tone="magic"
        variant="weak"
        prefixIcon={<IconSparkle2 />}
        title="새로운 기능"
        description="마법 같은 소식이 도착했어요!"
      />
    </VStack>
  );
}
