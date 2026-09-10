import "./styles";

import { root, useState } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import {
  ActionablePageBanner,
  DismissiblePageBanner,
  PageBanner,
} from "@/components/ui/page-banner";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [open, setOpen] = useState(true);

  function handleTap() {
    "background only";
  }

  function handleDismiss() {
    "background only";
    setOpen(false);
  }

  return (
    <page className={seedClassName}>
      <view className="page-banner-preview">
        <PageBanner description="새로운 소식을 확인해 보세요." />
        <ActionablePageBanner
          title="알림"
          description="전체 배너를 탭할 수 있어요."
          bindtap={handleTap}
          accessibility-label="새로운 소식 확인"
        />
        <DismissiblePageBanner
          open={open}
          description="닫을 수 있는 안내 메시지예요."
          onDismiss={handleDismiss}
        />
      </view>
    </page>
  );
}

root.render(<Root />);
