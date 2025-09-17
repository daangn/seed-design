import {
  IconChevronRightLine,
  IconPersonCircleLine,
  IconSlashCircleLine,
} from "@karrotmarket/react-monochrome-icon";
import { Divider, Icon, RadioGroup, VStack } from "@seed-design/react";
import { List, ListButtonItem, ListCheckItem, ListRadioItem } from "@/registry/ui/list";
import { Checkmark } from "@/registry/ui/checkbox";
import { RadioMark } from "@/registry/ui/radio-group";

export default function ListDisabled() {
  return (
    <VStack width="full">
      <List>
        <ListButtonItem
          prefix={<Icon svg={<IconPersonCircleLine />} />}
          title="활성화된 ListButtonItem"
          suffix={<Icon svg={<IconChevronRightLine />} />}
        />
      </List>
      <List as="fieldset">
        <ListCheckItem
          prefix={<Icon svg={<IconPersonCircleLine />} />}
          title="활성화된 ListCheckItem"
          suffix={<Checkmark size="large" />}
        />
      </List>
      <List asChild>
        <RadioGroup.Root defaultValue="foo" aria-label="옵션 선택">
          <ListRadioItem
            prefix={<Icon svg={<IconPersonCircleLine />} />}
            title="활성화된 ListRadioItem"
            suffix={<RadioMark size="large" />}
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
          suffix={<Icon svg={<IconChevronRightLine />} />}
        />
      </List>
      <List as="fieldset">
        <ListCheckItem
          disabled
          prefix={<Icon svg={<IconSlashCircleLine />} />}
          title="비활성화된 ListCheckItem"
          suffix={<Checkmark size="large" />}
        />
      </List>
      <List asChild>
        <RadioGroup.Root defaultValue="foo" aria-label="옵션 선택">
          <ListRadioItem
            disabled
            prefix={<Icon svg={<IconSlashCircleLine />} />}
            title="비활성화된 ListRadioItem"
            suffix={<RadioMark size="large" />}
            value="foo"
          />
        </RadioGroup.Root>
      </List>
    </VStack>
  );
}
