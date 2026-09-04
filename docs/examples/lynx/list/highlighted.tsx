import "./styles";

import IconPersonCircleLine from "@karrotmarket/lynx-monochrome-icon/IconPersonCircleLine";
import { root, useState } from "@lynx-js/react";
import { PrefixIcon, useSeedClassName } from "@seed-design/lynx-react";

import { List, ListButtonItem, ListDivider, ListItem } from "@/components/ui/list";
import { Switch } from "@/components/ui/switch";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [highlighted, setHighlighted] = useState(true);

  return (
    <page className={seedClassName}>
      <view className="list-preview__sections">
        <List>
          <ListButtonItem
            prefix={<PrefixIcon icon={<IconPersonCircleLine />} />}
            title="버튼"
            detail="Enim aute duis magna mollit aute sit aliquip duis ut tempor sunt."
          />
          <ListDivider />
          <ListButtonItem
            highlighted
            prefix={<PrefixIcon icon={<IconPersonCircleLine />} />}
            title="하이라이트된 버튼"
            detail="Enim aute duis magna mollit aute sit aliquip duis ut tempor sunt."
          />
          <ListDivider />
          <ListButtonItem
            highlighted
            disabled
            prefix={<PrefixIcon icon={<IconPersonCircleLine />} />}
            title="하이라이트 및 비활성화된 버튼"
            detail="Enim aute duis magna mollit aute sit aliquip duis ut tempor sunt."
          />
        </List>
        <List>
          <ListItem
            prefix={<PrefixIcon icon={<IconPersonCircleLine />} />}
            title="하이라이트"
            highlighted={highlighted}
          />
        </List>
        <view className="list-preview__row">
          <text>highlight</text>
          <Switch checked={highlighted} onCheckedChange={setHighlighted} />
        </view>
      </view>
    </page>
  );
}

root.render(<Root />);
