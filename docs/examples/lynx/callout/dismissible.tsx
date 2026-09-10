import "./styles";

import IconXmarkLine from "@karrotmarket/lynx-monochrome-icon/IconXmarkLine";
import { root, useState } from "@lynx-js/react";
import { ActionButton, Callout, SuffixIcon, useSeedClassName } from "@seed-design/lynx-react";

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
      <view className="callout-preview">
        <text className="callout-preview__status">열림: {JSON.stringify(open)}</text>
        <Callout.Root open={open} onDismiss={handleDismiss} tone="positive">
          <Callout.Content>
            <Callout.Title>완료</Callout.Title>
            <Callout.Description>설정이 저장되었어요.</Callout.Description>
          </Callout.Content>
          <Callout.CloseButton accessibility-label="닫기">
            <SuffixIcon icon={<IconXmarkLine />} />
          </Callout.CloseButton>
        </Callout.Root>
        {!open ? <ActionButton bindtap={handleOpen}>다시 열기</ActionButton> : null}
      </view>
    </page>
  );
}

root.render(<Root />);
