import { IconPlusCircleLine, IconWonLine } from "@karrotmarket/react-monochrome-icon";
import { HStack, VStack } from "@seed-design/react";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldInputBothAffixes() {
  return (
    <VStack width="full" gap="spacingY.componentDefault">
      <HStack gap="x3">
        <TextField
          label="나이"
          description="오늘 기준, 만 나이를 입력해주세요."
          prefix="만"
          suffix="세"
        >
          <TextFieldInput placeholder="플레이스홀더" />
        </TextField>
        <TextField
          label="금액"
          description="정산할 금액을 입력해주세요."
          prefixIcon={<IconPlusCircleLine />}
          suffixIcon={<IconWonLine aria-label="원" aria-hidden={false} />}
        >
          <TextFieldInput placeholder="플레이스홀더" />
        </TextField>
      </HStack>
      <HStack gap="x3">
        <TextField
          variant="underline"
          description="오늘 기준, 만 나이를 입력해주세요."
          prefix="만"
          suffix="세"
        >
          <TextFieldInput aria-label="나이" placeholder="플레이스홀더" />
        </TextField>
        <TextField
          variant="underline"
          description="정산할 금액을 입력해주세요."
          prefixIcon={<IconPlusCircleLine />}
          suffixIcon={<IconWonLine aria-label="원" aria-hidden={false} />}
        >
          <TextFieldInput aria-label="금액" placeholder="플레이스홀더" />
        </TextField>
      </HStack>
    </VStack>
  );
}
