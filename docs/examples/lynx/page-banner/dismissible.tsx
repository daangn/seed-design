import "./styles";

import IconXmarkLine from "@karrotmarket/lynx-monochrome-icon/IconXmarkLine";
import { root, useState } from "@lynx-js/react";
import { ActionButton, PageBanner, SuffixIcon, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [open, setOpen] = useState(true);

  function handleDismiss() {
    "background only";
    setOpen(false);
  }

  function handleOpen() {
    "background only";
    setOpen(true);
  }

  return (
    <page className={seedClassName}>
      <view className="page-banner-preview">
        <text className="page-banner-preview__status">열림: {JSON.stringify(open)}</text>
        <PageBanner.Root open={open} onDismiss={handleDismiss} tone="positive">
          <PageBanner.Content>
            <PageBanner.Body>
              <PageBanner.Title>완료</PageBanner.Title>
              <PageBanner.Description>설정이 저장되었어요.</PageBanner.Description>
            </PageBanner.Body>
          </PageBanner.Content>
          <PageBanner.CloseButton accessibility-label="닫기">
            <SuffixIcon icon={<IconXmarkLine accessibility-elements-hidden={true} />} />
          </PageBanner.CloseButton>
        </PageBanner.Root>
        {!open ? <ActionButton bindtap={handleOpen}>다시 열기</ActionButton> : null}
      </view>
    </page>
  );
}

root.render(<Root />);
