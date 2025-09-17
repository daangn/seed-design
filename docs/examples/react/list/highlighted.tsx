import { IconPersonCircleLine } from "@karrotmarket/react-monochrome-icon";
import { Box, Icon, VStack } from "@seed-design/react";
import { useState } from "react";
import { List, ListDivider, ListItem } from "@/registry/ui/list";
import { Switch } from "@/registry/ui/switch";

export default function ListHighlighted() {
  const [highlighted, setHighlighted] = useState(true);

  return (
    <VStack width="full" gap="x4">
      <List>
        <ListItem
          prefix={<Icon svg={<IconPersonCircleLine />} />}
          title="하이라이트되지 않은 항목"
          detail="Enim aute duis magna mollit aute sit aliquip duis ut tempor sunt."
        />
        <ListDivider />
        <ListItem
          highlighted
          prefix={<Icon svg={<IconPersonCircleLine />} />}
          title="하이라이트된 항목"
          detail="Enim aute duis magna mollit aute sit aliquip duis ut tempor sunt."
        />
      </List>
      <List>
        <ListItem
          prefix={<Icon svg={<IconPersonCircleLine />} />}
          title="하이라이트"
          highlighted={highlighted}
        />
      </List>
      <Box alignSelf="center">
        <Switch
          size="24"
          label="highlight"
          checked={highlighted}
          onCheckedChange={setHighlighted}
        />
      </Box>
    </VStack>
  );
}
