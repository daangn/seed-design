import "./styles";

import IconCheckmarkFatFill from "@karrotmarket/lynx-monochrome-icon/IconCheckmarkFatFill";
import { root } from "@lynx-js/react";
import { Badge, Checkbox, HStack, useSeedClassName } from "@seed-design/lynx-react";

import { List, ListCheckItem, ListDivider } from "@/components/ui/list";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="list-preview list-preview--centered">
        <List>
          <ListCheckItem
            title={
              <HStack gap="x1_5" align="center">
                <text>알림 수신 동의</text>
                <Badge variant="weak">권장</Badge>
              </HStack>
            }
            detail="푸시 알림을 받으시겠습니까?"
            defaultChecked
          />
          <ListDivider />
          <ListCheckItem
            title="마케팅 정보 수신 동의"
            detail="마케팅 정보를 받으시겠습니까?"
            prefix={
              <Checkbox.Control tone="neutral" size="large">
                <Checkbox.Indicator checked={<IconCheckmarkFatFill />} />
              </Checkbox.Control>
            }
            suffix={null}
            defaultChecked
          />
          <ListDivider />
          <ListCheckItem
            prefix={
              <Checkbox.Control tone="neutral" size="large" variant="ghost">
                <Checkbox.Indicator
                  unchecked={<IconCheckmarkFatFill />}
                  checked={<IconCheckmarkFatFill />}
                />
              </Checkbox.Control>
            }
            suffix={null}
            title="Ghost Variant"
          />
        </List>
      </view>
    </page>
  );
}

root.render(<Root />);
