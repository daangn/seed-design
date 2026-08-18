import { root, useState } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { TextField, TextFieldInput } from "@/components/ui/text-field";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [value, setValue] = useState("");
  return (
    <page className={seedClassName}>
      <view className="text-field-preview">
        <TextField
          label="라벨"
          description="6글자까지 입력 가능합니다"
          maxGraphemeCount={6}
          value={value}
          onValueChange={({ slicedValue }) => setValue(slicedValue)}
        >
          <TextFieldInput accessibility-label="라벨" placeholder="플레이스홀더" />
        </TextField>
      </view>
    </page>
  );
}

root.render(<Root />);
