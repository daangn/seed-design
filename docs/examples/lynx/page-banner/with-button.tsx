import "./styles";

import { useSeedClassName } from "@seed-design/lynx-react";
import { PageBanner, PageBannerButton } from "@/components/ui/page-banner";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  function handleTap() {
    "background only";
  }

  return (
    <view className={`${seedClassName} docs-lynx-page-banner-root`}>
      <view className="page-banner-preview">
        <PageBanner
          description="사업자 정보를 등록해 주세요."
          suffix={<PageBannerButton bindtap={handleTap}>자세히 보기</PageBannerButton>}
        />
      </view>
    </view>
  );
}
