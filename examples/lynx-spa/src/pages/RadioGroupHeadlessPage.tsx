import { useState } from "@lynx-js/react";
import { RadioGroup, useRadioGroupItemContext } from "@seed-design/lynx-react-radio-group";

import { CatalogExamples, CatalogSectionTitle } from "../components/catalog-examples.jsx";
import "../styles/radio-group-headless.css";

function Dot() {
  const { checked, disabled, pressed } = useRadioGroupItemContext();
  const className = [
    "radio-headless-control",
    checked && "radio-headless-control-checked",
    pressed && "radio-headless-control-pressed",
    disabled && "radio-headless-control-disabled",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <RadioGroup.ItemControl className={className}>
      {checked ? <view className="radio-headless-dot" /> : null}
    </RadioGroup.ItemControl>
  );
}

function Option({
  value,
  label,
  disabled,
  onTap,
}: {
  value: string;
  label: string;
  disabled?: boolean;
  onTap?: () => void;
}) {
  return (
    <RadioGroup.Item
      className="radio-headless-item"
      value={value}
      disabled={disabled}
      accessibility-label={label}
      bindtap={onTap}
    >
      <Dot />
      <text className={disabled ? "radio-headless-label-disabled" : "radio-headless-label"}>
        {label}
      </text>
    </RadioGroup.Item>
  );
}

function UncontrolledExample() {
  const [log, setLog] = useState<string[]>([]);
  const push = (entry: string) => setLog((current) => [...current.slice(-3), entry]);

  return (
    <RadioGroup.Root
      className="radio-headless-root"
      accessibility-label="배송 방법"
      defaultValue="parcel"
      onValueChange={(value) => push(`change:${value}`)}
    >
      <RadioGroup.Label className="radio-headless-group-label">배송 방법</RadioGroup.Label>
      <Option value="parcel" label="택배" onTap={() => push("tap:parcel")} />
      <Option value="direct" label="직거래" onTap={() => push("tap:direct")} />
      <Option value="quick" label="퀵 (준비 중)" disabled onTap={() => push("tap:quick")} />
      <RadioGroup.Description className="radio-headless-description">
        {`log: ${log.join(" → ") || "-"}`}
      </RadioGroup.Description>
    </RadioGroup.Root>
  );
}

function ControlledExample() {
  const [value, setValue] = useState("morning");
  const [disabled, setDisabled] = useState(false);

  return (
    <view className="radio-headless-section">
      <RadioGroup.Root
        className="radio-headless-root"
        accessibility-label="방문 시간"
        value={value}
        disabled={disabled}
        invalid={value === "night"}
        onValueChange={setValue}
      >
        <Option value="morning" label="오전" />
        <Option value="afternoon" label="오후" />
        <Option value="night" label="야간" />
        {value === "night" ? (
          <RadioGroup.ErrorMessage className="radio-headless-error">
            야간 방문은 선택할 수 없어요.
          </RadioGroup.ErrorMessage>
        ) : null}
      </RadioGroup.Root>
      <text className="radio-headless-description">{`value=${value} disabled=${disabled}`}</text>
      <view className="radio-headless-actions">
        <view className="radio-headless-button" bindtap={() => setValue("afternoon")}>
          <text className="radio-headless-button-text">외부에서 오후 선택</text>
        </view>
        <view className="radio-headless-button" bindtap={() => setDisabled((current) => !current)}>
          <text className="radio-headless-button-text">
            {disabled ? "Root 활성화" : "Root 비활성화"}
          </text>
        </view>
      </view>
    </view>
  );
}

export function RadioGroupHeadlessPage() {
  return (
    <CatalogExamples title="RadioGroup (Headless)" gap="12px">
      <CatalogSectionTitle>Uncontrolled · Item disabled</CatalogSectionTitle>
      <UncontrolledExample />
      <CatalogSectionTitle>Controlled · Root disabled · invalid</CatalogSectionTitle>
      <ControlledExample />
    </CatalogExamples>
  );
}
