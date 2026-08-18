import { root } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { TextField, TextFieldInput } from "@/components/ui/text-field";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <view className="text-field-preview">
        <TextField label="라벨">
          <TextFieldInput accessibility-label="라벨" />
        </TextField>
      </view>
    </page>
  );
}

root.render(<Root />);
