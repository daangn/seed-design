import "./styles";

import IconChevronRightLine from "@karrotmarket/lynx-monochrome-icon/IconChevronRightLine";
import { root, useState } from "@lynx-js/react";
import { PageBanner, SuffixIcon, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [tapCount, setTapCount] = useState(0);

  function handleTap() {
    "background only";
    setTapCount((count) => count + 1);
  }

  return (
    <page className={seedClassName}>
      <view className="page-banner-preview">
        <text className="page-banner-preview__status">탭 횟수: {JSON.stringify(tapCount)}</text>
        <PageBanner.Root tone="warning" bindtap={handleTap} accessibility-label="확인할 내용 열기">
          <PageBanner.Content>
            <PageBanner.Body>
              <PageBanner.Title>확인 필요</PageBanner.Title>
              <PageBanner.Description>탭해서 상세 내용을 확인하세요.</PageBanner.Description>
            </PageBanner.Body>
          </PageBanner.Content>
          <SuffixIcon icon={<IconChevronRightLine accessibility-elements-hidden={true} />} />
        </PageBanner.Root>
      </view>
    </page>
  );
}

root.render(<Root />);
