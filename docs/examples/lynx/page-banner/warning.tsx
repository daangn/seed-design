import "./styles";

import IconExclamationmarkTriangleFill from "@karrotmarket/lynx-monochrome-icon/IconExclamationmarkTriangleFill";
import { root } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { PageBanner, PageBannerButton } from "@/components/ui/page-banner";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="page-banner-preview">
        <PageBanner
          tone="warning"
          variant="weak"
          prefixIcon={<IconExclamationmarkTriangleFill />}
          title="주의"
          description="입력한 내용을 다시 확인해 주세요."
          suffix={<PageBannerButton>확인</PageBannerButton>}
        />
        <PageBanner
          tone="warning"
          variant="solid"
          prefixIcon={<IconExclamationmarkTriangleFill />}
          title="주의"
          description="입력한 내용을 다시 확인해 주세요."
          suffix={<PageBannerButton>확인</PageBannerButton>}
        />
      </view>
    </page>
  );
}

root.render(<Root />);
