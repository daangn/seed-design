import "./styles";

import IconChevronRightLine from "@karrotmarket/lynx-monochrome-icon/IconChevronRightLine";
import IconXmarkLine from "@karrotmarket/lynx-monochrome-icon/IconXmarkLine";
import { root } from "@lynx-js/react";
import { Callout, SuffixIcon, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  function handleTap() {
    "background only";
  }

  return (
    <page className={seedClassName}>
      <view className="callout-preview">
        <Callout.Root>
          <Callout.Content>
            <Callout.Description>새로운 소식을 확인해 보세요.</Callout.Description>
          </Callout.Content>
        </Callout.Root>

        <Callout.Root bindtap={handleTap} accessibility-label="새로운 소식 확인">
          <Callout.Content>
            <Callout.Title>알림</Callout.Title>
            <Callout.Description>새로운 소식을 확인해 보세요.</Callout.Description>
          </Callout.Content>
          <SuffixIcon icon={<IconChevronRightLine />} />
        </Callout.Root>

        <Callout.Root>
          <Callout.Content>
            <Callout.Description>닫을 수 있는 안내 메시지예요.</Callout.Description>
          </Callout.Content>
          <Callout.CloseButton accessibility-label="닫기">
            <SuffixIcon icon={<IconXmarkLine />} />
          </Callout.CloseButton>
        </Callout.Root>
      </view>
    </page>
  );
}

root.render(<Root />);
