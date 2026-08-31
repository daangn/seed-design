import "./styles";

import { root } from "@lynx-js/react";
import { PageBanner, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  function handleTap() {
    "background only";
  }

  return (
    <page className={seedClassName}>
      <view className="page-banner-preview">
        <PageBanner.Root tone="informative">
          <PageBanner.Content>
            <PageBanner.Body>
              <PageBanner.Title>업데이트</PageBanner.Title>
              <PageBanner.Description>새로운 기능이 추가되었어요.</PageBanner.Description>
            </PageBanner.Body>
            <PageBanner.Button bindtap={handleTap}>자세히 보기</PageBanner.Button>
          </PageBanner.Content>
        </PageBanner.Root>
      </view>
    </page>
  );
}

root.render(<Root />);
