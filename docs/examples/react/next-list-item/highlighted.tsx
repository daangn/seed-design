import { IconPersonCircleLine } from "@karrotmarket/react-monochrome-icon";
import { Box, Icon, VStack } from "@seed-design/react";
import { useState } from "react";
import { List, ListDivider } from "seed-design/ui/list";
import { NextListItem, NextListButtonItem } from "seed-design/ui/next-list-item";
import { Switch } from "seed-design/ui/switch";

export default function ListHighlighted() {
  const [highlighted, setHighlighted] = useState(true);

  return (
    <VStack width="360px" gap="x4">
      <List>
        <NextListButtonItem
          prefix={<Icon svg={<IconPersonCircleLine />} />}
          title="버튼"
          detail="Enim aute duis magna mollit aute sit aliquip duis ut tempor sunt."
          onClick={() => {}}
        />
        <ListDivider />
        <NextListButtonItem
          highlighted
          prefix={<Icon svg={<IconPersonCircleLine />} />}
          title="하이라이트된 버튼"
          detail="Enim aute duis magna mollit aute sit aliquip duis ut tempor sunt."
          onClick={() => {}}
        />
        <ListDivider />
        <NextListButtonItem
          highlighted
          disabled
          prefix={<Icon svg={<IconPersonCircleLine />} />}
          title="하이라이트 및 비활성화된 버튼"
          detail="Enim aute duis magna mollit aute sit aliquip duis ut tempor sunt."
          onClick={() => {}}
        />
      </List>
      <List>
        <NextListItem
          prefix={<Icon svg={<IconPersonCircleLine />} />}
          title="하이라이트"
          highlighted={highlighted}
        />
      </List>
      <Box alignSelf="center">
        <Switch
          size="24"
          tone="neutral"
          label="highlight"
          checked={highlighted}
          onCheckedChange={setHighlighted}
        />
      </Box>
    </VStack>
  );
}
