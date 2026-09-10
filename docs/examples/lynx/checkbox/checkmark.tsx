import "./styles";

import { HStack, Text, useSeedClassName } from "@seed-design/lynx-react";
import { Checkbox } from "@/components/ui/checkbox";

interface CustomCheckboxProps {
  label: string;
  textStyle: "t7Regular" | "t7Medium" | "t7Bold";
  defaultChecked?: boolean;
}

function CustomCheckbox({ label, textStyle, defaultChecked }: CustomCheckboxProps) {
  return (
    <Checkbox
      accessibility-label={label}
      tone="neutral"
      defaultChecked={defaultChecked}
      style={{ flexDirection: "column", rowGap: "8px", alignItems: "center" }}
    >
      <Text textStyle={textStyle}>{label}</Text>
    </Checkbox>
  );
}

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-checkbox-root`}>
      <HStack className="checkbox-preview" gap="x6">
        <CustomCheckbox label="regular" textStyle="t7Regular" />
        <CustomCheckbox label="medium" textStyle="t7Medium" defaultChecked />
        <CustomCheckbox label="bold" textStyle="t7Bold" />
      </HStack>
    </view>
  );
}
