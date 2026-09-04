import "./styles";

import IconChevronRightLine from "@karrotmarket/lynx-monochrome-icon/IconChevronRightLine";
import IconLockLine from "@karrotmarket/lynx-monochrome-icon/IconLockLine";
import IconPersonCircleLine from "@karrotmarket/lynx-monochrome-icon/IconPersonCircleLine";
import IconQuestionmarkCircleFill from "@karrotmarket/lynx-monochrome-icon/IconQuestionmarkCircleFill";
import { root } from "@lynx-js/react";
import { ActionButton, PrefixIcon, SuffixIcon, useSeedClassName } from "@seed-design/lynx-react";

import { List, ListButtonItem, ListDivider } from "@/components/ui/list";
import { ListHeader } from "@/components/ui/list-header";

function AccountList() {
  return (
    <List>
      <ListButtonItem
        title="내 계정"
        detail="이메일과 연락처, 본인 인증 관리"
        prefix={<PrefixIcon icon={<IconPersonCircleLine />} />}
        suffix={<SuffixIcon icon={<IconChevronRightLine />} />}
      />
      <ListButtonItem
        title="보안 · 인증 관리"
        detail="비밀번호, 생체 인증 사용을 관리해요"
        prefix={<PrefixIcon icon={<IconLockLine />} />}
        suffix={<SuffixIcon icon={<IconChevronRightLine />} />}
      />
    </List>
  );
}

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="list-preview__sections">
        <view className="list-preview__section">
          <ListHeader variant="mediumWeak">variant=&quot;mediumWeak&quot;</ListHeader>
          <AccountList />
        </view>
        <ListDivider />
        <view className="list-preview__section">
          <ListHeader variant="boldSolid">variant=&quot;boldSolid&quot;</ListHeader>
          <AccountList />
        </view>
        <ListDivider />
        <view className="list-preview__section">
          <view className="list-preview__row list-preview__header-row">
            <ListHeader>List Header with Action Button</ListHeader>
            <ActionButton variant="ghost" size="small">
              <PrefixIcon icon={<IconQuestionmarkCircleFill />} />
              도움말
            </ActionButton>
          </view>
          <AccountList />
        </view>
      </view>
    </page>
  );
}

root.render(<Root />);
