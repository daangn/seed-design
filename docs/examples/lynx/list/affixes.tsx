import "./styles";

import IconArrowUpBracketDownFill from "@karrotmarket/lynx-monochrome-icon/IconArrowUpBracketDownFill";
import IconILowercaseSerifCircleLine from "@karrotmarket/lynx-monochrome-icon/IconILowercaseSerifCircleLine";
import { root, useState } from "@lynx-js/react";
import { ActionButton, Icon, PrefixIcon, useSeedClassName } from "@seed-design/lynx-react";

import { List, ListDivider, ListItem } from "@/components/ui/list";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [pressed, setPressed] = useState(false);

  return (
    <page className={seedClassName}>
      <List>
        <ListItem
          prefix={
            <view className="list-preview__avatar">
              <text className="list-preview__avatar-label">A</text>
            </view>
          }
          title="Prefix에 Avatar 넣기"
          detail="Amet elit ullamco magna."
        />
        <ListDivider />
        <ListItem
          title="Prefix에 아이콘 넣기"
          detail="Deserunt nulla elit est."
          prefix={<PrefixIcon icon={<IconILowercaseSerifCircleLine />} />}
        />
        <ListDivider />
        <ListItem
          title="Suffix에 Action Button 넣기"
          detail="Veniam non est non ut consequat."
          suffix={
            <ActionButton size="xsmall" variant="neutralWeak">
              액션 버튼
            </ActionButton>
          }
        />
        <ListDivider />
        <ListItem
          title="Suffix에 Action Button (Ghost) 넣기"
          detail="Deserunt nulla elit est."
          suffix={
            <ActionButton size="small" variant="ghost" layout="iconOnly" accessibility-label="공유">
              <Icon icon={<IconArrowUpBracketDownFill />} />
            </ActionButton>
          }
        />
        <ListDivider />
        <ListItem
          title="Suffix에 토글 액션 넣기"
          detail="Sit eu incididunt aute ea elit ex."
          suffix={
            <ActionButton
              size="xsmall"
              variant={pressed ? "neutralSolid" : "neutralWeak"}
              bindtap={() => {
                "background only";
                setPressed((value) => !value);
              }}
            >
              {pressed ? "선택됨" : "토글 버튼"}
            </ActionButton>
          }
        />
      </List>
    </page>
  );
}

root.render(<Root />);
