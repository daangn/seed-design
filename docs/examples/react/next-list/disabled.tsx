import {
  IconChevronRightLine,
  IconPersonCircleLine,
  IconSlashCircleLine,
} from "@karrotmarket/react-monochrome-icon";
import { Divider, Icon, VStack } from "@seed-design/react";
import { RadioGroup } from "@seed-design/react/primitive";
import { NextList, NextListButtonItem, NextListCheckItem, NextListRadioItem } from "seed-design/ui/next-list";
import { Checkmark } from "seed-design/ui/checkbox";
import { Radiomark } from "seed-design/ui/radio-group";

export default function ListDisabled() {
  return (
    <VStack width="360px">
      <NextList>
        <NextListButtonItem
          prefix={<Icon svg={<IconPersonCircleLine />} />}
          title="활성화된 NextListButtonItem"
          detail="Cupidatat et pariatur amet."
          suffix={<Icon svg={<IconChevronRightLine />} />}
        />
      </NextList>
      <NextList as="fieldset">
        <NextListCheckItem
          prefix={<Icon svg={<IconPersonCircleLine />} />}
          title="활성화된 NextListCheckItem"
          suffix={<Checkmark tone="neutral" size="large" />}
        />
      </NextList>
      <NextList asChild>
        <RadioGroup.Root defaultValue="foo" aria-label="옵션 선택">
          <NextListRadioItem
            prefix={<Icon svg={<IconPersonCircleLine />} />}
            title="활성화된 NextListRadioItem"
            suffix={<Radiomark tone="neutral" size="large" />}
            value="foo"
          />
        </RadioGroup.Root>
      </NextList>
      <Divider />
      <NextList>
        <NextListButtonItem
          disabled
          prefix={<Icon svg={<IconSlashCircleLine />} />}
          title="비활성화된 NextListButtonItem"
          detail="Cupidatat et pariatur amet."
          suffix={<Icon svg={<IconChevronRightLine />} />}
        />
      </NextList>
      <NextList as="fieldset">
        <NextListCheckItem
          disabled
          prefix={<Icon svg={<IconSlashCircleLine />} />}
          title="비활성화된 NextListCheckItem"
          suffix={<Checkmark tone="neutral" size="large" />}
        />
      </NextList>
      <NextList asChild>
        <RadioGroup.Root defaultValue="foo" aria-label="옵션 선택">
          <NextListRadioItem
            disabled
            prefix={<Icon svg={<IconSlashCircleLine />} />}
            title="비활성화된 NextListRadioItem"
            suffix={<Radiomark tone="neutral" size="large" />}
            value="foo"
          />
        </RadioGroup.Root>
      </NextList>
    </VStack>
  );
}
