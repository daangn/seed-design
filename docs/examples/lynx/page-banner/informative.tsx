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
          tone="informative"
          variant="weak"
          prefixIcon={<IconExclamationmarkCircleFill />}
          title="안내"
          description="새로운 정보를 확인해 주세요."
          suffix={<PageBannerButton>확인하기</PageBannerButton>}
        />
        <PageBanner
          tone="informative"
          variant="solid"
          prefixIcon={<IconExclamationmarkCircleFill />}
          title="안내"
          description="새로운 정보를 확인해 주세요."
          suffix={<PageBannerButton>확인하기</PageBannerButton>}
        />
      </view>
    </page>
  );
}

root.render(<Root />);
