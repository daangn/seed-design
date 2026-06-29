import { IconPersonCircleLine } from "@karrotmarket/react-monochrome-icon";
import { Box, Icon, VStack } from "@seed-design/react";
import { useState } from "react";
import { NextList, NextListDivider, NextListItem, NextListButtonItem } from "seed-design/ui/next-list";
import { Switch } from "seed-design/ui/switch";

export default function ListHighlighted() {
  const [highlighted, setHighlighted] = useState(true);

  return (
    <VStack width="360px" gap="x4">
      <NextList>
        <NextListButtonItem
          prefix={<Icon svg={<IconPersonCircleLine />} />}
          title="버튼"
          detail="Enim aute duis magna mollit aute sit aliquip duis ut tempor sunt."
          onClick={() => {}}
        />
        <NextListDivider />
        <NextListButtonItem
          highlighted
          prefix={<Icon svg={<IconPersonCircleLine />} />}
          title="하이라이트된 버튼"
          detail="Enim aute duis magna mollit aute sit aliquip duis ut tempor sunt."
          onClick={() => {}}
        />
        <NextListDivider />
        <NextListButtonItem
          highlighted
          disabled
          prefix={<Icon svg={<IconPersonCircleLine />} />}
          title="하이라이트 및 비활성화된 버튼"
          detail="Enim aute duis magna mollit aute sit aliquip duis ut tempor sunt."
          onClick={() => {}}
        />
      </NextList>
      <NextList>
        <NextListItem
          prefix={<Icon svg={<IconPersonCircleLine />} />}
          title="하이라이트"
          highlighted={highlighted}
        />
      </NextList>
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
