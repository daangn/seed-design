import "./styles";

import IconExclamationmarkCircleFill from "@karrotmarket/lynx-monochrome-icon/IconExclamationmarkCircleFill";
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
          tone="neutral"
          variant="weak"
          prefixIcon={<IconExclamationmarkCircleFill />}
          title="미노출"
          description="사업자 정보를 등록해주세요."
          suffix={<PageBannerButton>등록하기</PageBannerButton>}
        />
        <PageBanner
          tone="neutral"
          variant="solid"
          prefixIcon={<IconExclamationmarkCircleFill />}
          title="미노출"
          description="사업자 정보를 등록해주세요."
          suffix={<PageBannerButton>등록하기</PageBannerButton>}
        />
        <ActionablePageBanner
          tone="neutral"
          variant="weak"
          prefixIcon={<IconExclamationmarkCircleFill />}
          title="미노출"
          description="사업자 정보를 등록해주세요."
          bindtap={handleTap}
          accessibility-label="미노출, 사업자 정보를 등록해주세요."
        />
        <ActionablePageBanner
          tone="neutral"
          variant="solid"
          prefixIcon={<IconExclamationmarkCircleFill />}
          title="미노출"
          description="사업자 정보를 등록해주세요."
          bindtap={handleTap}
          accessibility-label="미노출, 사업자 정보를 등록해주세요."
        />
        <DismissiblePageBanner
          tone="neutral"
          variant="weak"
          prefixIcon={<IconExclamationmarkCircleFill />}
          title="미노출"
          description="사업자 정보를 등록해주세요."
        />
        <DismissiblePageBanner
          tone="neutral"
          variant="solid"
          prefixIcon={<IconExclamationmarkCircleFill />}
          title="미노출"
          description="사업자 정보를 등록해주세요."
        />
      </view>
    </page>
  );
}

root.render(<Root />);
