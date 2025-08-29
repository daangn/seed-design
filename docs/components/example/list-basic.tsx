import { List, ListItem } from "seed-design/ui/list";

export default function ListBasic() {
  return (
    <List width="full">
      <ListItem title="첫 번째 아이템" showDivider />
      <ListItem title="두 번째 아이템" showDivider />
      <ListItem title="세 번째 아이템" />
    </List>
  );
}
