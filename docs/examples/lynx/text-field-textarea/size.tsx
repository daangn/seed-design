import { root } from "@lynx-js/react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import { TextField, TextFieldTextarea } from "@/components/ui/text-field";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <VStack className="text-field-textarea-preview text-field-textarea-preview__fields" gap="x3">
        <TextField label="라벨" description="size=large (default)" size="large">
          <TextFieldTextarea accessibility-label="라벨" placeholder="플레이스홀더" />
        </TextField>
        <TextField label="라벨" description="size=medium" size="medium">
          <TextFieldTextarea accessibility-label="라벨" placeholder="플레이스홀더" />
        </TextField>
      </VStack>
    </page>
  );
}
root.render(<Root />);
