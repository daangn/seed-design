import { root } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { TextField, TextFieldTextarea } from "@/components/ui/text-field";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <view className="text-field-textarea-preview">
        <TextField label="라벨">
          <TextFieldTextarea accessibility-label="라벨" />
        </TextField>
      </view>
    </page>
  );
}
root.render(<Root />);
