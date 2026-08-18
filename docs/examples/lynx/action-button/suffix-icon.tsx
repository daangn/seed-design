import IconChevronRightFill from "@karrotmarket/lynx-monochrome-icon/IconChevronRightFill";
import { root } from "@lynx-js/react";
import { ActionButton, SuffixIcon, useSeedClassName } from "@seed-design/lynx-react";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <view className="action-button-preview">
        <ActionButton>
          라벨
          <SuffixIcon icon={<IconChevronRightFill />} />
        </ActionButton>
      </view>
    </page>
  );
}

root.render(<Root />);
