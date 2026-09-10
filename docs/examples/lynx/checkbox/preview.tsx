import "./styles";

import { root } from "@lynx-js/react";
import IconCheckmarkFatFill from "@karrotmarket/lynx-monochrome-icon/IconCheckmarkFatFill";
import IconMinusFatFill from "@karrotmarket/lynx-monochrome-icon/IconMinusFatFill";
import { Checkbox, useSeedClassName } from "@seed-design/lynx-react";

function CheckboxItem({
  label,
  defaultChecked = false,
  indeterminate = false,
}: {
  label: string;
  defaultChecked?: boolean;
  indeterminate?: boolean;
}) {
  return (
    <Checkbox.Root
      tone="neutral"
      size="large"
      defaultChecked={defaultChecked}
      indeterminate={indeterminate}
    >
      <Checkbox.Control>
        <Checkbox.Indicator
          checked={<IconCheckmarkFatFill />}
          indeterminate={<IconMinusFatFill />}
        />
      </Checkbox.Control>
      <Checkbox.Label>{label}</Checkbox.Label>
    </Checkbox.Root>
  );
}

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <Checkbox.Group className="checkbox-preview">
        <CheckboxItem label="선택 안 됨" />
        <CheckboxItem label="선택됨" defaultChecked />
        <CheckboxItem label="일부 선택됨" indeterminate />
      </Checkbox.Group>
    </page>
  );
}

root.render(<Root />);
