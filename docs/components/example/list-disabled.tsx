import {
  IconChevronRightLine,
  IconPersonCircleLine,
  IconSlashCircleLine,
} from "@karrotmarket/react-monochrome-icon";
import { Divider, Icon, RadioGroup, VStack } from "@seed-design/react";
import { List, ListItemButton, ListItemCheck, ListItemRadio } from "seed-design/ui/list";

export default function ListDisabled() {
  return (
    <VStack width="full">
      <List>
        <ListItemButton
          prefix={<Icon svg={<IconPersonCircleLine />} />}
          title="활성화된 ListItemButton"
          suffix={<Icon svg={<IconChevronRightLine />} />}
        />
      </List>
      <List as="fieldset">
        <ListItemCheck
          prefix={<Icon svg={<IconPersonCircleLine />} />}
          title="활성화된 ListItemCheck"
        />
      </List>
      <List asChild>
        <RadioGroup.Root defaultValue="foo" aria-label="옵션 선택">
          <ListItemRadio
            prefix={<Icon svg={<IconPersonCircleLine />} />}
            title="활성화된 ListItemRadio"
            value="foo"
          />
        </RadioGroup.Root>
      </List>
      <Divider />
      <List>
        <ListItemButton
          disabled
          prefix={<Icon svg={<IconSlashCircleLine />} />}
          title="비활성화된 ListItemButton"
          suffix={<Icon svg={<IconChevronRightLine />} />}
        />
      </List>
      <List as="fieldset">
        <ListItemCheck
          disabled
          prefix={<Icon svg={<IconSlashCircleLine />} />}
          title="비활성화된 ListItemCheck"
        />
      </List>
      <List asChild>
        <RadioGroup.Root defaultValue="foo" aria-label="옵션 선택">
          <ListItemRadio
            disabled
            prefix={<Icon svg={<IconSlashCircleLine />} />}
            title="비활성화된 ListItemRadio"
            value="foo"
          />
        </RadioGroup.Root>
      </List>
    </VStack>
  );
}
