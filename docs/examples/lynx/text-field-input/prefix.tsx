import "./styles";

import IconMagnifyingglassLine from "@karrotmarket/lynx-monochrome-icon/IconMagnifyingglassLine";

import { useSeedClassName, VStack } from "@seed-design/lynx-react";
import { TextField, TextFieldInput } from "@/components/ui/text-field";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-text-field-input-root`}>
      <VStack className="text-field-input-preview">
        <VStack className="text-field-input-preview__content" gap="spacingY.componentDefault">
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
          <TextField
            variant="underline"
            description="프로필이나 페이지 URL을 입력해주세요."
            prefix="https://"
          >
            <TextFieldInput accessibility-label="소셜 미디어 URL" placeholder="example.com" />
          </TextField>
          <TextField
            variant="underline"
            description="글 제목 또는 내용으로 검색할 수 있습니다."
            prefixIcon={<IconMagnifyingglassLine />}
          >
            <TextFieldInput accessibility-label="검색" placeholder="레모네이드 레시피" />
          </TextField>
        </VStack>
      </VStack>
    </view>
  );
}
