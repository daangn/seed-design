import "./styles";

import { PageBanner, PageBannerButton } from "@/components/ui/page-banner";

export default function Example() {
  function handleTap() {
    "background only";
  }

  return (
    <view className="page-banner-preview">
      <PageBanner
        description="사업자 정보를 등록해 주세요."
        suffix={<PageBannerButton bindtap={handleTap}>자세히 보기</PageBannerButton>}
      />
    </view>
  );
}
