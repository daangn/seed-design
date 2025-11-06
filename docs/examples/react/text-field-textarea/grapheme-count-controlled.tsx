import { TextField, TextFieldTextarea } from "seed-design/ui/text-field";
import { useState } from "react";
import { Text, VStack } from "@seed-design/react";

export default function TextFieldTextareaGraphemeControlled() {
  const [value, setValue] = useState("");
  const [graphemes, setGraphemes] = useState<string[]>([]);

  return (
    <VStack gap="x4" width="full" align="center">
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
        <TextFieldTextarea placeholder="플레이스홀더" />
      </TextField>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          rowGap: "16px",
          columnGap: "32px",
          padding: "16px",
        }}
      >
        <Text textStyle="t3Medium">
          <code>graphemes.length</code>: {graphemes.length}
        </Text>
        <Text textStyle="t3Medium">
          <code>value.length</code>: {value.length}
        </Text>
        <Text textStyle="t3Medium">
          <code>graphemes</code>: {JSON.stringify(graphemes)}
        </Text>
        <Text textStyle="t3Medium" style={{ whiteSpace: "pre-wrap" }}>
          <code>value</code>: {value}
        </Text>
      </div>
    </VStack>
  );
}
