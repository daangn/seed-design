import { root } from "@lynx-js/react";
import IconPlusCircleLine from "@karrotmarket/lynx-monochrome-icon/IconPlusCircleLine";
import IconWonLine from "@karrotmarket/lynx-monochrome-icon/IconWonLine";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import { TextField, TextFieldInput } from "@/components/ui/text-field";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <VStack className="text-field-preview text-field-preview__fields" gap="x3">
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
          suffixIcon={<IconWonLine />}
        >
          <TextFieldInput accessibility-label="금액" placeholder="플레이스홀더" />
        </TextField>
      </VStack>
    </page>
  );
}

root.render(<Root />);
