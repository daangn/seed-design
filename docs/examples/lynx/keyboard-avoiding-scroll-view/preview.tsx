import { root } from "@lynx-js/react";
import {
  KeyboardAvoidingScrollView,
  TextField,
  VStack,
  useSeedClassName,
} from "@seed-design/lynx-react";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <KeyboardAvoidingScrollView
        className="keyboard-preview"
        keyboardGap={24}
        scrollBehavior="smooth"
      >
        <VStack className="keyboard-preview__content" gap="x4">
          <text className="keyboard-preview__title">프로필 입력</text>
          <TextField.Root>
            <TextField.Input accessibility-label="제목" placeholder="제목" />
          </TextField.Root>
          <view className="keyboard-preview__spacer" />
          <TextField.Root>
            <TextField.Textarea
              accessibility-label="내용"
              placeholder="키보드에 가리지 않아야 하는 내용"
            />
          </TextField.Root>
        </VStack>
      </KeyboardAvoidingScrollView>
    </page>
  );
}
root.render(<Root />);
