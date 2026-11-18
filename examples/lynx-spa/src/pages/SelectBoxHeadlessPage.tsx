import { useState } from "@lynx-js/react";
import { Checkbox, useCheckboxContext } from "@seed-design/lynx-react-checkbox";
import {
  Collapsible,
  CollapsibleProvider,
  useCollapsible,
} from "@seed-design/lynx-react-collapsible";
import { RadioGroup, useRadioGroupItemContext } from "@seed-design/lynx-react-radio-group";

import "../styles/select-box-headless.css";

type CardContentProps = {
  label: string;
  description: string;
  footer: string;
};

function CheckCardContent({ label, description, footer }: CardContentProps) {
  const { checked, indeterminate, disabled, pressed } = useCheckboxContext();
  const collapsible = useCollapsible({ open: checked });
  const className = [
    "select-box-headless-card",
    checked && "select-box-headless-card-selected",
    pressed && "select-box-headless-card-pressed",
    disabled && "select-box-headless-card-disabled",
  ]
    .filter(Boolean)
    .join(" ");
  const controlClassName = [
    "select-box-headless-check",
    (checked || indeterminate) && "select-box-headless-check-selected",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <view className={className}>
      <view className="select-box-headless-card-header">
        <view className="select-box-headless-card-copy">
          <text className="select-box-headless-label">{label}</text>
          <text className="select-box-headless-description">{description}</text>
        </view>
        <Checkbox.Control className={controlClassName}>
          {indeterminate ? (
            <view className="select-box-headless-check-mixed" />
          ) : checked ? (
            <text className="select-box-headless-check-mark">✓</text>
          ) : null}
        </Checkbox.Control>
      </view>
      <CollapsibleProvider value={collapsible}>
        <Collapsible.Content>
          <view className="select-box-headless-footer">
            <text className="select-box-headless-footer-text">{footer}</text>
          </view>
        </Collapsible.Content>
      </CollapsibleProvider>
    </view>
  );
}

function CheckExample() {
  const [selection, setSelection] = useState({ checked: false, indeterminate: true });

  return (
    <view className="select-box-headless-section">
      <Checkbox.Root
        className="select-box-headless-item"
        accessibility-label="관심 상품 알림"
        checked={selection.checked}
        indeterminate={selection.indeterminate}
        onCheckedChange={(checked) => {
          "background only";
          setSelection({ checked, indeterminate: false });
        }}
      >
        <CheckCardContent
          label="관심 상품 알림"
          description="부분 선택 상태에서 누르면 모든 상품의 알림을 선택해요."
          footer="모든 관심 상품의 가격 변동 알림을 받을 수 있어요."
        />
      </Checkbox.Root>
      <Checkbox.Root
        className="select-box-headless-item"
        accessibility-label="거래 알림"
        defaultChecked
      >
        <CheckCardContent
          label="거래 알림"
          description="거래 일정과 새로운 메시지를 알려드려요."
          footer="거래 약속 하루 전과 새로운 메시지가 도착하면 알려드려요."
        />
      </Checkbox.Root>
      <Checkbox.Root
        className="select-box-headless-item"
        accessibility-label="동네 소식 알림 (준비 중)"
        disabled
      >
        <CheckCardContent
          label="동네 소식 알림 (준비 중)"
          description="지금은 선택할 수 없는 항목이에요."
          footer="동네의 새로운 소식을 알려드려요."
        />
      </Checkbox.Root>
      <text className="select-box-headless-description">
        {`checked=${selection.checked} indeterminate=${selection.indeterminate}`}
      </text>
      <view
        className="select-box-headless-button"
        accessibility-element
        accessibility-role-description="button"
        accessibility-label="관심 상품 알림을 부분 선택으로 초기화"
        bindtap={() => setSelection({ checked: false, indeterminate: true })}
      >
        <text className="select-box-headless-button-text">부분 선택으로 초기화</text>
      </view>
    </view>
  );
}

function RadioCardContent({ label, description, footer }: CardContentProps) {
  const { checked, disabled, pressed } = useRadioGroupItemContext();
  const collapsible = useCollapsible({ open: checked });
  const className = [
    "select-box-headless-card",
    checked && "select-box-headless-card-selected",
    pressed && "select-box-headless-card-pressed",
    disabled && "select-box-headless-card-disabled",
  ]
    .filter(Boolean)
    .join(" ");
  const controlClassName = [
    "select-box-headless-radio",
    checked && "select-box-headless-radio-selected",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <view className={className}>
      <view className="select-box-headless-card-header">
        <view className="select-box-headless-card-copy">
          <text className="select-box-headless-label">{label}</text>
          <text className="select-box-headless-description">{description}</text>
        </view>
        <RadioGroup.ItemControl className={controlClassName}>
          {checked ? <view className="select-box-headless-radio-dot" /> : null}
        </RadioGroup.ItemControl>
      </view>
      <CollapsibleProvider value={collapsible}>
        <Collapsible.Content>
          <view className="select-box-headless-footer">
            <text className="select-box-headless-footer-text">{footer}</text>
          </view>
        </Collapsible.Content>
      </CollapsibleProvider>
    </view>
  );
}

function RadioExample() {
  const [value, setValue] = useState("parcel");

  return (
    <view className="select-box-headless-section">
      <RadioGroup.Root
        className="select-box-headless-section"
        accessibility-label="배송 방법"
        value={value}
        onValueChange={setValue}
      >
        <RadioGroup.Item
          className="select-box-headless-item"
          value="parcel"
          accessibility-label="택배"
        >
          <RadioCardContent
            label="택배"
            description="원하는 주소로 상품을 받아보세요."
            footer="배송은 보통 2~3일 걸려요. 배송비는 3,000원이에요."
          />
        </RadioGroup.Item>
        <RadioGroup.Item
          className="select-box-headless-item"
          value="direct"
          accessibility-label="직거래"
        >
          <RadioCardContent
            label="직거래"
            description="가까운 곳에서 직접 만나 거래해요."
            footer="채팅으로 만날 장소와 시간을 정해주세요."
          />
        </RadioGroup.Item>
        <RadioGroup.Item
          className="select-box-headless-item"
          value="quick"
          accessibility-label="퀵 배송 (준비 중)"
          disabled
        >
          <RadioCardContent
            label="퀵 배송 (준비 중)"
            description="지금은 선택할 수 없는 배송 방법이에요."
            footer="선택하면 당일 배송으로 받아볼 수 있어요."
          />
        </RadioGroup.Item>
      </RadioGroup.Root>
      <text className="select-box-headless-description">{`value=${value}`}</text>
    </view>
  );
}

export function SelectBoxHeadlessPage() {
  return (
    <scroll-view scroll-y className="select-box-headless-page">
      <text className="select-box-headless-title">SelectBox (Headless)</text>
      <text className="select-box-headless-description">
        Checkbox · RadioGroup · Collapsible의 동작만 사용하고, 스타일은 이 화면에서 정의해요.
      </text>
      <text className="select-box-headless-section-title">다중 선택 · 부분 선택 · 비활성화</text>
      <CheckExample />
      <text className="select-box-headless-section-title">단일 선택 · 선택한 항목의 하단 내용</text>
      <RadioExample />
    </scroll-view>
  );
}
