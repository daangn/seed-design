import "./styles";

import IconSparkle2 from "@karrotmarket/lynx-multicolor-icon/IconSparkle2";
import { root } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import {
  ActionablePageBanner,
  DismissiblePageBanner,
  PageBanner,
  PageBannerButton,
} from "@/components/ui/page-banner";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  function handleTap() {
    "background only";
  }

  return (
    <page className={seedClassName}>
      <view className="page-banner-preview">
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
          bindtap={handleTap}
          accessibility-label="새로운 기능, 마법 같은 소식이 도착했어요!"
        />
        <DismissiblePageBanner
          tone="magic"
          variant="weak"
          prefixIcon={<IconSparkle2 />}
          title="새로운 기능"
          description="마법 같은 소식이 도착했어요!"
        />
      </view>
    </page>
  );
}

root.render(<Root />);
