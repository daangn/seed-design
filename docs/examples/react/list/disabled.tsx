import {
  IconChevronRightLine,
  IconPersonCircleLine,
  IconSlashCircleLine,
} from "@karrotmarket/react-monochrome-icon";
import { Divider, Icon, VStack } from "@seed-design/react";
import { RadioGroup } from "@seed-design/react/primitive";
import { List, ListButtonItem, ListCheckItem, ListRadioItem } from "seed-design/ui/list";
import { Checkmark } from "seed-design/ui/checkbox";
import { Radiomark } from "seed-design/ui/radio-group";

export default function ListDisabled() {
  return (
    <VStack width="360px">
      <List>
        <ListButtonItem
          prefix={<Icon svg={<IconPersonCircleLine />} />}
          title="활성화된 ListButtonItem"
          detail="Cupidatat et pariatur amet."
          suffix={<Icon svg={<IconChevronRightLine />} />}
        />
      </List>
      <List as="fieldset">
        <ListCheckItem
          prefix={<Icon svg={<IconPersonCircleLine />} />}
          title="활성화된 ListCheckItem"
          suffix={<Checkmark tone="neutral" size="large" />}
        />
      </List>
      <List asChild>
        <RadioGroup.Root defaultValue="foo" aria-label="옵션 선택">
          <ListRadioItem
            prefix={<Icon svg={<IconPersonCircleLine />} />}
            title="활성화된 ListRadioItem"
            suffix={<Radiomark tone="neutral" size="large" />}
            value="foo"
          />
        </RadioGroup.Root>
      </List>
      <Divider />
      <List>
        <ListButtonItem
          disabled
          prefix={<Icon svg={<IconSlashCircleLine />} />}
          title="비활성화된 ListButtonItem"
          detail="Cupidatat et pariatur amet."
          suffix={<Icon svg={<IconChevronRightLine />} />}
        />
      </List>
      <List as="fieldset">
        <ListCheckItem
          disabled
          prefix={<Icon svg={<IconSlashCircleLine />} />}
          title="비활성화된 ListCheckItem"
          suffix={<Checkmark tone="neutral" size="large" />}
        />
      </List>
      <List asChild>
        <RadioGroup.Root defaultValue="foo" aria-label="옵션 선택">
          <ListRadioItem
            disabled
            prefix={<Icon svg={<IconSlashCircleLine />} />}
            title="비활성화된 ListRadioItem"
            suffix={<Radiomark tone="neutral" size="large" />}
            value="foo"
          />
        </RadioGroup.Root>
      </List>
    </VStack>
  );
}
