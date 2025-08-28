import {
  IconChevronRightLine,
  IconPersonCircleLine,
  IconSlashCircleLine,
} from "@karrotmarket/react-monochrome-icon";
import { Divider, Icon, RadioGroup } from "@seed-design/react";
import { List, ListItemButton, ListItemCheckbox, ListItemRadio } from "seed-design/ui/list";

export default function ListDisabled() {
  return (
    <List width="full">
      <ListItemButton
        prefix={<Icon svg={<IconPersonCircleLine />} />}
        title="활성화된 항목"
        detail="Enim aute duis magna mollit aute sit aliquip duis ut tempor sunt."
        suffix={<Icon svg={<IconChevronRightLine />} />}
      />
      <ListItemCheckbox
        prefix={<Icon svg={<IconPersonCircleLine />} />}
        title="활성화된 항목"
        detail="Enim aute duis magna mollit aute sit aliquip duis ut tempor sunt."
      />
      <RadioGroup.Root>
        <ListItemRadio
          prefix={<Icon svg={<IconPersonCircleLine />} />}
          title="활성화된 항목"
          detail="Enim aute duis magna mollit aute sit aliquip duis ut tempor sunt."
          value="foo"
        />
      </RadioGroup.Root>
      <Divider />
      <ListItemButton
        disabled
        prefix={<Icon svg={<IconSlashCircleLine />} />}
        title="비활성화된 항목"
        detail="Enim aute duis magna mollit aute sit aliquip duis ut tempor sunt."
        suffix={<Icon svg={<IconChevronRightLine />} />}
      />
      <ListItemCheckbox
        disabled
        prefix={<Icon svg={<IconSlashCircleLine />} />}
        title="비활성화된 항목"
        detail="Enim aute duis magna mollit aute sit aliquip duis ut tempor sunt."
      />
      <RadioGroup.Root>
        <ListItemRadio
          disabled
          prefix={<Icon svg={<IconSlashCircleLine />} />}
          title="비활성화된 항목"
          detail="Enim aute duis magna mollit aute sit aliquip duis ut tempor sunt."
          value="foo"
        />
      </RadioGroup.Root>
    </List>
  );
}
