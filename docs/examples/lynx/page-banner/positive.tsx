import "./styles";

import IconCheckmarkCircleFill from "@karrotmarket/lynx-monochrome-icon/IconCheckmarkCircleFill";
import { root } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { PageBanner, PageBannerButton } from "@/components/ui/page-banner";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="page-banner-preview">
        <PageBanner
          tone="positive"
          variant="weak"
          prefixIcon={<IconCheckmarkCircleFill />}
          title="완료"
          description="설정이 저장되었어요."
          suffix={<PageBannerButton>확인</PageBannerButton>}
        />
        <PageBanner
          tone="positive"
          variant="solid"
          prefixIcon={<IconCheckmarkCircleFill />}
          title="완료"
          description="설정이 저장되었어요."
          suffix={<PageBannerButton>확인</PageBannerButton>}
        />
      </view>
    </page>
  );
}

root.render(<Root />);
