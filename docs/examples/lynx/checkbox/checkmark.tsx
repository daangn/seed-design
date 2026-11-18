import "./styles";

import type { ReactNode } from "@lynx-js/react";
import { Checkbox, HStack, Text } from "@seed-design/lynx-react";
import { Checkmark } from "@/components/ui/checkbox";

interface CustomCheckboxProps extends Checkbox.RootProps {
  label: string;
  children: ReactNode;
}

function CustomCheckbox({ label, children, ...props }: CustomCheckboxProps) {
  return (
    <Checkbox.Root
      accessibility-label={label}
      style={{ display: "flex", flexDirection: "column", rowGap: "8px", alignItems: "center" }}
      {...props}
    >
      <Checkmark tone="neutral" />
      {children}
    </Checkbox.Root>
  );
}

export default function Example() {
  return (
    <HStack className="checkbox-preview" gap="x6">
      <CustomCheckbox label="regular">
        <Text textStyle="t7Regular">regular</Text>
      </CustomCheckbox>
      <CustomCheckbox label="medium" defaultChecked>
        <Text textStyle="t7Medium">medium</Text>
      </CustomCheckbox>
      <CustomCheckbox label="bold">
        <Text textStyle="t7Bold">bold</Text>
      </CustomCheckbox>
    </HStack>
  );
}
