import "./styles";

import { root, useState } from "@lynx-js/react";
import { useSeedClassName, VStack } from "@seed-design/lynx-react";
import { TextField, TextFieldTextarea } from "@/components/ui/text-field";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [value, setValue] = useState("");
  const [graphemes, setGraphemes] = useState<string[]>([]);

  return (
    <page className={seedClassName}>
      <VStack width="full" height="full" align="center" justify="center">
        <VStack width="full" maxWidth="480px" gap="x4">
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
            <TextFieldTextarea accessibility-label="라벨" placeholder="플레이스홀더" />
          </TextField>
          <VStack gap="x2">
            <text className="text-field-textarea-preview__status">
              graphemes.length: {JSON.stringify(graphemes.length)}
            </text>
            <text className="text-field-textarea-preview__status">
              value.length: {JSON.stringify(value.length)}
            </text>
            <text className="text-field-textarea-preview__status">
              graphemes: {JSON.stringify(graphemes)}
            </text>
            <text className="text-field-textarea-preview__status">value: {value}</text>
          </VStack>
        </VStack>
      </VStack>
    </page>
  );
}

root.render(<Root />);
