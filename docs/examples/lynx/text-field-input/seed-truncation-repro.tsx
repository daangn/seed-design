import "./styles";

import { useState } from "@lynx-js/react";
import { VStack } from "@seed-design/lynx-react";
import { TextField, TextFieldInput } from "@/components/ui/text-field";

const INITIAL_VALUE =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export default function Example() {
  const [value, setValue] = useState(INITIAL_VALUE);

  return (
    <VStack className="text-field-input-preview__content" gap="x3">
      <TextField
        label="Input focus rendering"
        value={value}
        onValueChange={({ value: nextValue }) => setValue(nextValue)}
      >
        <TextFieldInput accessibility-label="Input focus rendering" />
      </TextField>
      <text className="text-field-input-preview__status">Value: {value}</text>
    </VStack>
  );
}
