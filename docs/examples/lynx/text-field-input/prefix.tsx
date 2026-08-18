import { root } from "@lynx-js/react";
import IconMagnifyingglassLine from "@karrotmarket/lynx-monochrome-icon/IconMagnifyingglassLine";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import { TextField, TextFieldInput } from "@/components/ui/text-field";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <VStack className="text-field-preview text-field-preview__fields" gap="x3">
        <TextField
          label="소셜 미디어 URL"
          description="프로필이나 페이지 URL을 입력해주세요."
          prefix="https://"
        >
          <TextFieldInput accessibility-label="소셜 미디어 URL" placeholder="example.com" />
        </TextField>
        <TextField
          label="검색"
          description="글 제목 또는 내용으로 검색할 수 있습니다."
          prefixIcon={<IconMagnifyingglassLine />}
        >
          <TextFieldInput accessibility-label="검색" placeholder="레모네이드 레시피" />
        </TextField>
      </VStack>
    </page>
  );
}

root.render(<Root />);
