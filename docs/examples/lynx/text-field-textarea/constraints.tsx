import { root } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { TextField, TextFieldTextarea } from "@/components/ui/text-field";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <view className="text-field-textarea-preview">
        <TextField label="라벨" description="설명을 써주세요">
          <TextFieldTextarea
            accessibility-label="라벨"
            placeholder="플레이스홀더"
            style={{ minHeight: "120px", maxHeight: "220px" }}
          />
        </TextField>
      </view>
    </page>
  );
}
root.render(<Root />);
