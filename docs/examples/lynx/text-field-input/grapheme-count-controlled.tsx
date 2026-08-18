import { root, useState } from "@lynx-js/react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import { TextField, TextFieldInput } from "@/components/ui/text-field";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [value, setValue] = useState("");
  const [graphemes, setGraphemes] = useState<string[]>([]);
  return (
    <page className={seedClassName}>
      <VStack className="text-field-preview text-field-preview__fields" gap="x4">
        <TextField
          label="라벨"
          description="국기 이모지 🇰🇷 를 추가해보세요."
          maxGraphemeCount={100}
          value={value}
          onValueChange={({ slicedValue, slicedGraphemes }) => {
            setValue(slicedValue);
            setGraphemes(slicedGraphemes);
          }}
        >
          <TextFieldInput accessibility-label="라벨" placeholder="플레이스홀더" />
        </TextField>
        <text className="text-field-preview__debug">graphemes.length: {graphemes.length}</text>
        <text className="text-field-preview__debug">value.length: {value.length}</text>
        <text className="text-field-preview__debug">graphemes: {JSON.stringify(graphemes)}</text>
        <text className="text-field-preview__debug">value: {value}</text>
      </VStack>
    </page>
  );
}

root.render(<Root />);
