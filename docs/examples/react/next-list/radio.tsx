import { RadioGroup } from "@seed-design/react/primitive";
import { NextList, NextListDivider, NextListRadioItem } from "seed-design/ui/next-list";
import { Radiomark } from "seed-design/ui/radio-group";

export default function ListRadio() {
  return (
    <NextList width="360px" asChild>
      <RadioGroup.Root defaultValue="option1" aria-label="옵션 선택">
        <NextListRadioItem
          value="option1"
          title="옵션 1"
          detail="첫 번째 선택지"
          suffix={<Radiomark tone="neutral" size="large" />}
        />
        <NextListDivider as="div" />
        <NextListRadioItem
          prefix={<Radiomark tone="neutral" size="large" />}
          value="option2"
          title="옵션 2"
          detail="두 번째 선택지"
        />
        <NextListDivider as="div" />
        <NextListRadioItem
          prefix={<Radiomark tone="neutral" size="large" />}
          value="option3"
          title="옵션 3"
          detail="세 번째 선택지"
        />
      </RadioGroup.Root>
    </NextList>
  );
}
