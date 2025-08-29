import {
  IconChevronRightLine,
  IconPersonCircleLine,
  IconSlashCircleLine,
} from "@karrotmarket/react-monochrome-icon";
import { Icon, RadioGroup } from "@seed-design/react";
import { List, ListItemButton, ListItemCheckbox, ListItemRadio } from "seed-design/ui/list";

export default function ListDisabled() {
  return (
    <List width="full">
      <ListItemButton
        prefix={<Icon svg={<IconPersonCircleLine />} />}
        title="활성화된 ListItemButton"
        suffix={<Icon svg={<IconChevronRightLine />} />}
      />
      <ListItemCheckbox
        prefix={<Icon svg={<IconPersonCircleLine />} />}
        title="활성화된 ListItemCheckbox"
      />
      <RadioGroup.Root defaultValue="foo">
        <ListItemRadio
          prefix={<Icon svg={<IconPersonCircleLine />} />}
          title="활성화된 ListItemRadio"
          value="foo"
          showDivider
        />
      </RadioGroup.Root>
      <ListItemButton
        disabled
        prefix={<Icon svg={<IconSlashCircleLine />} />}
        title="비활성화된 ListItemButton"
        suffix={<Icon svg={<IconChevronRightLine />} />}
      />
      <ListItemCheckbox
        disabled
        prefix={<Icon svg={<IconSlashCircleLine />} />}
        title="비활성화된 ListItemCheckbox"
      />
      <RadioGroup.Root defaultValue="foo">
        <ListItemRadio
          disabled
          prefix={<Icon svg={<IconSlashCircleLine />} />}
          title="비활성화된 ListItemRadio"
          value="foo"
        />
      </RadioGroup.Root>
    </List>
  );
}
