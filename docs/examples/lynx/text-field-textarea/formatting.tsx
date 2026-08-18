import { root, useMemo, useState } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { TextField, TextFieldTextarea } from "@/components/ui/text-field";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [value, setValue] = useState("");
  const formattedValue = useMemo(
    () =>
      value
        .split("")
        .filter((character) => character !== " ")
        .join(""),
    [value],
  );
  return (
    <page className={seedClassName}>
      <view className="text-field-textarea-preview">
        <TextField
          label="레이블"
          description="공백을 입력할 수 없어요"
          value={formattedValue}
          onValueChange={({ value: nextValue }) => setValue(nextValue)}
        >
          <TextFieldTextarea accessibility-label="레이블" placeholder="공백을 입력해보세요" />
        </TextField>
      </view>
    </page>
  );
}
root.render(<Root />);
