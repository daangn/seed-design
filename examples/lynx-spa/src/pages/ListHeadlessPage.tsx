import { useState } from "@lynx-js/react";
import { Checkbox, useCheckboxContext } from "@seed-design/lynx-react-checkbox";
import { RadioGroup, useRadioGroupItemContext } from "@seed-design/lynx-react-radio-group";
import { Switch, useSwitchContext } from "@seed-design/lynx-react-switch";
import { usePressTap } from "@seed-design/lynx-react-use-press-tap";

import { CatalogExamples, CatalogSectionTitle } from "../components/catalog-examples.jsx";
import "../styles/list-headless.css";

// List 패키지 없이 각 control의 Headless Root를 행 root로 쓰는 consumer다.
// 행 레이아웃과 표현은 이 화면의 CSS가 정하고, 상태·press·접근성은 Headless가 소유한다.

function rowClassName(pressed: boolean, disabled: boolean) {
  return [
    "list-headless-row",
    pressed && "list-headless-row-pressed",
    disabled && "list-headless-row-disabled",
  ]
    .filter(Boolean)
    .join(" ");
}

function RowText({ title, detail }: { title: string; detail?: string }) {
  return (
    <view className="list-headless-content">
      <text className="list-headless-title">{title}</text>
      {detail ? <text className="list-headless-detail">{detail}</text> : null}
    </view>
  );
}

function CheckboxMark() {
  const { checked, indeterminate } = useCheckboxContext();
  return (
    <Checkbox.Control
      className={
        checked || indeterminate
          ? "list-headless-check list-headless-check-on"
          : "list-headless-check"
      }
    >
      <text className="list-headless-check-text">{indeterminate ? "−" : checked ? "✓" : ""}</text>
    </Checkbox.Control>
  );
}

function CheckboxRow(props: {
  title: string;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  const { title, ...checkboxProps } = props;
  return (
    <Checkbox.Root
      {...checkboxProps}
      accessibility-label={title}
      className="list-headless-row-root"
    >
      <CheckboxRowBody title={title} />
    </Checkbox.Root>
  );
}

function CheckboxRowBody({ title }: { title: string }) {
  const { pressed, disabled } = useCheckboxContext();
  return (
    <view className={rowClassName(pressed, disabled)}>
      <RowText title={title} />
      <CheckboxMark />
    </view>
  );
}

function SwitchRowBody({ title, detail }: { title: string; detail?: string }) {
  const { checked, pressed, disabled } = useSwitchContext();
  return (
    <view className={rowClassName(pressed, disabled)}>
      <RowText title={title} detail={detail} />
      <Switch.Control
        className={
          checked ? "list-headless-switch list-headless-switch-on" : "list-headless-switch"
        }
      >
        <Switch.Thumb className="list-headless-thumb" />
      </Switch.Control>
    </view>
  );
}

function RadioRowBody({ title }: { title: string }) {
  const { checked, pressed, disabled } = useRadioGroupItemContext();
  return (
    <view className={rowClassName(pressed, disabled)}>
      <RowText title={title} />
      <RadioGroup.ItemControl
        className={checked ? "list-headless-radio list-headless-radio-on" : "list-headless-radio"}
      >
        {checked ? <view className="list-headless-radio-dot" /> : null}
      </RadioGroup.ItemControl>
    </view>
  );
}

function ButtonRow({
  title,
  detail,
  disabled = false,
  onTap,
}: {
  title: string;
  detail?: string;
  disabled?: boolean;
  onTap: () => void;
}) {
  const { pressed, ...pressHandlers } = usePressTap({ disabled, onTap });
  return (
    <view
      {...pressHandlers}
      accessibility-element
      accessibility-label={title}
      accessibility-role-description="button"
      accessibility-traits={disabled ? "disabled" : "button"}
      className={rowClassName(pressed, disabled)}
    >
      <RowText title={title} detail={detail} />
      <text className="list-headless-chevron">›</text>
    </view>
  );
}

export function ListHeadlessPage() {
  const [log, setLog] = useState<string[]>([]);
  const push = (entry: string) => setLog((current) => [...current.slice(-3), entry]);
  const [agreements, setAgreements] = useState({ terms: true, marketing: false });
  const [rowsDisabled, setRowsDisabled] = useState(false);
  const allChecked = agreements.terms && agreements.marketing;
  const someChecked = agreements.terms || agreements.marketing;

  return (
    <CatalogExamples title="List (Headless)" gap="12px">
      <CatalogSectionTitle>Checkbox 행 · controlled · indeterminate</CatalogSectionTitle>
      <view className="list-headless-list">
        <CheckboxRow
          title="전체 동의"
          checked={allChecked}
          indeterminate={someChecked && !allChecked}
          disabled={rowsDisabled}
          onCheckedChange={(checked) => {
            push(`all:${checked}`);
            setAgreements({ terms: checked, marketing: checked });
          }}
        />
        <CheckboxRow
          title="이용약관 동의"
          checked={agreements.terms}
          disabled={rowsDisabled}
          onCheckedChange={(terms) => {
            push(`terms:${terms}`);
            setAgreements((current) => ({ ...current, terms }));
          }}
        />
        <CheckboxRow
          title="마케팅 정보 수신 동의"
          checked={agreements.marketing}
          disabled={rowsDisabled}
          onCheckedChange={(marketing) => {
            push(`marketing:${marketing}`);
            setAgreements((current) => ({ ...current, marketing }));
          }}
        />
      </view>

      <CatalogSectionTitle>Switch 행 · uncontrolled</CatalogSectionTitle>
      <view className="list-headless-list">
        <Switch.Root
          className="list-headless-row-root"
          accessibility-label="메시지 요약"
          defaultChecked
          disabled={rowsDisabled}
          onCheckedChange={(checked) => push(`summary:${checked}`)}
        >
          <SwitchRowBody title="메시지 요약" detail="핵심 내용만 빠르게 확인해요" />
        </Switch.Root>
      </view>

      <CatalogSectionTitle>Radio 행 · item disabled</CatalogSectionTitle>
      <RadioGroup.Root
        className="list-headless-list"
        accessibility-label="배송 방법"
        defaultValue="parcel"
        disabled={rowsDisabled}
        onValueChange={(value) => push(`delivery:${value}`)}
      >
        <RadioGroup.Item
          className="list-headless-row-root"
          value="parcel"
          accessibility-label="택배"
        >
          <RadioRowBody title="택배" />
        </RadioGroup.Item>
        <RadioGroup.Item
          className="list-headless-row-root"
          value="direct"
          accessibility-label="직거래"
        >
          <RadioRowBody title="직거래" />
        </RadioGroup.Item>
        <RadioGroup.Item
          className="list-headless-row-root"
          value="quick"
          disabled
          accessibility-label="퀵 (준비 중)"
        >
          <RadioRowBody title="퀵 (준비 중)" />
        </RadioGroup.Item>
      </RadioGroup.Root>

      <CatalogSectionTitle>Button 행 · usePressTap</CatalogSectionTitle>
      <view className="list-headless-list">
        <ButtonRow
          title="내 계정"
          detail="이메일과 연락처 관리"
          disabled={rowsDisabled}
          onTap={() => push("tap:account")}
        />
      </view>

      <text className="list-headless-log">{`log: ${log.join(" → ") || "-"}`}</text>
      <view className="list-headless-button" bindtap={() => setRowsDisabled((value) => !value)}>
        <text className="list-headless-button-text">
          {rowsDisabled ? "모든 행 활성화" : "모든 행 비활성화"}
        </text>
      </view>
    </CatalogExamples>
  );
}
