import { root, useMemo, useState } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { TextField, TextFieldInput } from "@/components/ui/text-field";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [value, setValue] = useState("1000");
  const formattedValue = useMemo(() => {
    if (value === "") return value;
    const number = Number(value.replace(/,/g, ""));
    return Number.isNaN(number) ? "" : number.toLocaleString();
  }, [value]);
  return (
    <page className={seedClassName}>
      <view className="text-field-preview">
        <TextField
          label="금액"
          description="금액을 써주세요"
          value={formattedValue}
          onValueChange={({ value: nextValue }) => setValue(nextValue)}
        >
          <TextFieldInput accessibility-label="금액" placeholder="9,999,999" />
        </TextField>
      </view>
    </page>
  );
}

root.render(<Root />);
