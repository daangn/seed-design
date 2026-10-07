import "./styles";

import IconPlusCircleLine from "@karrotmarket/lynx-monochrome-icon/IconPlusCircleLine";
import IconWonLine from "@karrotmarket/lynx-monochrome-icon/IconWonLine";

import { VStack } from "@seed-design/lynx-react";
import { TextField, TextFieldInput } from "@/components/ui/text-field";

export default function Example() {
  return (
    <VStack className="text-field-input-preview__content" gap="spacingY.componentDefault">
      <TextField
        label="나이"
        description="오늘 기준, 만 나이를 입력해주세요."
        prefix="만"
        suffix="세"
      >
        <TextFieldInput accessibility-label="나이" placeholder="플레이스홀더" />
      </TextField>
      <TextField
        label="금액"
        description="정산할 금액을 입력해주세요."
        prefixIcon={<IconPlusCircleLine />}
        suffixIcon={<IconWonLine accessibility-label="원" />}
      >
        <TextFieldInput accessibility-label="금액" placeholder="플레이스홀더" />
      </TextField>
      <TextField
        variant="underline"
        description="오늘 기준, 만 나이를 입력해주세요."
        prefix="만"
        suffix="세"
      >
        <TextFieldInput accessibility-label="나이" placeholder="플레이스홀더" />
      </TextField>
      <TextField
        variant="underline"
        description="정산할 금액을 입력해주세요."
        prefixIcon={<IconPlusCircleLine />}
        suffixIcon={<IconWonLine accessibility-label="원" />}
      >
        <TextFieldInput accessibility-label="금액" placeholder="플레이스홀더" />
      </TextField>
    </VStack>
  );
}
