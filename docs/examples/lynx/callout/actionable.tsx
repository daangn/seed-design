import "./styles";

import IconChevronRightLine from "@karrotmarket/lynx-monochrome-icon/IconChevronRightLine";
import { root, useState } from "@lynx-js/react";
import { Callout, SuffixIcon, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [tapCount, setTapCount] = useState(0);

  function handleTap() {
    "background only";
    setTapCount((count) => count + 1);
  }

  return (
    <page className={seedClassName}>
      <view className="callout-preview">
        <text className="callout-preview__status">탭 횟수: {JSON.stringify(tapCount)}</text>
        <Callout.Root tone="informative" bindtap={handleTap} accessibility-label="업데이트 확인">
          <Callout.Content>
            <Callout.Title>업데이트</Callout.Title>
            <Callout.Description>새로운 기능을 확인해 보세요.</Callout.Description>
          </Callout.Content>
          <SuffixIcon icon={<IconChevronRightLine />} />
        </Callout.Root>
      </view>
    </page>
  );
}

root.render(<Root />);
