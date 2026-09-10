import "./styles";

import IconExclamationmarkCircleFill from "@karrotmarket/lynx-monochrome-icon/IconExclamationmarkCircleFill";
import { root } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { PageBanner, PageBannerButton } from "@/components/ui/page-banner";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="page-banner-preview">
        <PageBanner
          tone="critical"
          variant="weak"
          prefixIcon={<IconExclamationmarkCircleFill />}
          title="오류"
          description="요청을 처리하지 못했어요."
          suffix={<PageBannerButton>다시 시도</PageBannerButton>}
        />
        <PageBanner
          tone="critical"
          variant="solid"
          prefixIcon={<IconExclamationmarkCircleFill />}
          title="오류"
          description="요청을 처리하지 못했어요."
          suffix={<PageBannerButton>다시 시도</PageBannerButton>}
        />
      </view>
    </page>
  );
}

root.render(<Root />);
