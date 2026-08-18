import { root } from "@lynx-js/react";
import IconCheckmarkFatFill from "@karrotmarket/lynx-monochrome-icon/IconCheckmarkFatFill";
import IconMinusFatFill from "@karrotmarket/lynx-monochrome-icon/IconMinusFatFill";
import { Checkbox, VStack, useSeedClassName } from "@seed-design/lynx-react";
import "./styles";

function CheckboxItem({
  label,
  defaultChecked = false,
}: {
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <Checkbox.Root tone="neutral" size="large" defaultChecked={defaultChecked}>
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
      <VStack className="checkbox-preview" gap="x3">
        <text className="checkbox-preview__title">관심 분야</text>
        <text className="checkbox-preview__description">관심 있는 분야를 모두 선택해 주세요.</text>
        <Checkbox.Group>
          <CheckboxItem label="디자인" />
          <CheckboxItem label="개발" defaultChecked />
          <CheckboxItem label="마케팅" />
        </Checkbox.Group>
      </VStack>
    </page>
  );
}

root.render(<Root />);
