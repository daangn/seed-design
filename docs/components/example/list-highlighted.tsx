import { IconPersonCircleLine } from "@karrotmarket/react-monochrome-icon";
import { Divider, Icon } from "@seed-design/react";
import { List, ListItem } from "seed-design/ui/list";

export default function ListHighlighted() {
  return (
    <List width="full">
      <ListItem
        prefix={<Icon svg={<IconPersonCircleLine />} />}
        title="하이라이트되지 않은 항목"
        detail="Enim aute duis magna mollit aute sit aliquip duis ut tempor sunt."
      />
      <Divider as="div" />
      <ListItem
        highlighted
        prefix={<Icon svg={<IconPersonCircleLine />} />}
        title="하이라이트된 항목"
        detail="Enim aute duis magna mollit aute sit aliquip duis ut tempor sunt."
      />
    </List>
  );
}
