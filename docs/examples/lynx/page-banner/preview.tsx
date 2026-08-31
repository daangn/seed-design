import "./styles";

import { root } from "@lynx-js/react";
import { PageBanner, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="page-banner-preview">
        <PageBanner.Root>
          <PageBanner.Content>
            <PageBanner.Body>
              <PageBanner.Title>알림</PageBanner.Title>
              <PageBanner.Description>
                새로운 소식을 확인해 보세요. 긴 설명은 사용 가능한 너비에 맞춰 여러 줄로 표시됩니다.
              </PageBanner.Description>
            </PageBanner.Body>
          </PageBanner.Content>
        </PageBanner.Root>
      </view>
    </page>
  );
}

root.render(<Root />);
