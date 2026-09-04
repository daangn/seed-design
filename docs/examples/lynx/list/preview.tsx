import "./styles";

import { root } from "@lynx-js/react";
import IconILowercaseSerifCircleLine from "@karrotmarket/lynx-monochrome-icon/IconILowercaseSerifCircleLine";
import IconPersonCircleLine from "@karrotmarket/lynx-monochrome-icon/IconPersonCircleLine";
import { PrefixIcon, SuffixIcon, useSeedClassName } from "@seed-design/lynx-react";

import { ListHeader } from "@/components/ui/list-header";
import { List, ListDivider, ListItem } from "@/components/ui/list";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="list-preview">
        <ListHeader>리스트 헤더</ListHeader>
        <List>
          <ListItem title="기본 리스트 아이템" />
          <ListDivider />
          <ListItem
            prefix={<PrefixIcon icon={<IconPersonCircleLine />} />}
            title="아이콘이 있는 리스트 아이템"
            detail="부가 정보가 포함된 설명"
            suffix={<SuffixIcon icon={<IconILowercaseSerifCircleLine />} />}
          />
        </List>
      </view>
    </page>
  );
}

root.render(<Root />);
