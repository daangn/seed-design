import { useState } from "@lynx-js/react";
import { Switch, useSwitchContext } from "@seed-design/lynx-react-switch";

import { CatalogExamples, CatalogSectionTitle } from "../components/catalog-examples.jsx";
import "../styles/switch-headless.css";

function Track() {
  const { checked, disabled, pressed } = useSwitchContext();
  const stateClassName = checked
    ? pressed
      ? "switch-headless-control-checked-pressed"
      : "switch-headless-control-checked"
    : pressed
      ? "switch-headless-control-pressed"
      : null;
  const className = [
    "switch-headless-control",
    stateClassName,
    disabled ? "switch-headless-control-disabled" : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Switch.Control className={className}>
      <Switch.Thumb className="switch-headless-thumb" />
    </Switch.Control>
  );
}

interface ItemProps {
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onTap?: () => void;
}

function Item({ label, disabled, onTap, ...props }: ItemProps) {
  return (
    <Switch.Root
      {...props}
      className="switch-headless-root"
      disabled={disabled}
      accessibility-label={label}
      bindtap={onTap}
    >
      <text className={disabled ? "switch-headless-label-disabled" : "switch-headless-label"}>
        {label}
      </text>
      <Track />
    </Switch.Root>
  );
}

function UncontrolledExample() {
  const [log, setLog] = useState<string[]>([]);
  const push = (entry: string) => setLog((current) => [...current.slice(-3), entry]);

  return (
    <view className="switch-headless-section">
      <Item
        label="채팅 알림"
        defaultChecked
        onTap={() => push("tap")}
        onCheckedChange={(checked) => push(`change:${checked}`)}
      />
      <Item label="마케팅 알림 (변경 불가)" disabled onTap={() => push("tap:disabled")} />
      <text className="switch-headless-description">{`log: ${log.join(" → ") || "-"}`}</text>
    </view>
  );
}

function ControlledExample() {
  const [notification, setNotification] = useState(true);
  const [doNotDisturb, setDoNotDisturb] = useState(false);

  return (
    <view className="switch-headless-section">
      <Item label="알림 받기" checked={notification} onCheckedChange={setNotification} />
      <Item
        label="방해 금지"
        checked={doNotDisturb}
        disabled={!notification}
        onCheckedChange={setDoNotDisturb}
      />
      <text className="switch-headless-description">
        {`notification=${notification} doNotDisturb=${doNotDisturb}`}
      </text>
      <view className="switch-headless-actions">
        <view
          className="switch-headless-button"
          bindtap={() => setDoNotDisturb((current) => !current)}
        >
          <text className="switch-headless-button-text">외부에서 방해 금지 전환</text>
        </view>
      </view>
    </view>
  );
}

export function SwitchHeadlessPage() {
  return (
    <CatalogExamples title="Switch (Headless)" gap="12px">
      <CatalogSectionTitle>Uncontrolled · Root disabled</CatalogSectionTitle>
      <UncontrolledExample />
      <CatalogSectionTitle>Controlled · 부모 상태로 disabled</CatalogSectionTitle>
      <ControlledExample />
    </CatalogExamples>
  );
}
