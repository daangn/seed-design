import { useState } from "@lynx-js/react";
import type { ReactNode } from "@lynx-js/react";
import {
  Select,
  useSelectItemContext,
  type SelectOpenChangeDetails,
} from "@seed-design/lynx-react-select";

import { CatalogExamples, CatalogSectionTitle } from "../components/catalog-examples.jsx";
import "../styles/select-headless.css";

const longList = Array.from({ length: 30 }, (_, index) => `항목 ${index + 1}`);

function ItemBody() {
  const { label, selected, disabled, pressed } = useSelectItemContext();
  const labelClassName = disabled
    ? "select-headless-label select-headless-label-disabled"
    : "select-headless-label";

  return (
    <view
      className={
        pressed ? "select-headless-item-body select-headless-pressed" : "select-headless-item-body"
      }
    >
      <text className={labelClassName}>{label}</text>
      {selected ? <text className="select-headless-check">✓</text> : null}
    </view>
  );
}

function Item({ value, disabled }: { value: string; disabled?: boolean }) {
  return (
    <Select.Item value={value} label={value} disabled={disabled}>
      <ItemBody />
    </Select.Item>
  );
}

function Trigger() {
  return (
    <Select.Trigger className="select-headless-trigger" accessibility-label="항목">
      <Select.Value className="select-headless-trigger-label" />
      <Select.Placeholder className="select-headless-trigger-placeholder">
        선택하세요
      </Select.Placeholder>
    </Select.Trigger>
  );
}

/** SelectContent가 ScrollArea의 목록 크기로 위치와 viewport 높이를 정한다. */
function Surface({
  children,
  ...positionerProps
}: Select.PositionerProps & { children: ReactNode }) {
  return (
    <Select.Positioner className="select-headless-positioner" {...positionerProps}>
      <Select.Content className="select-headless-content" maxHeight={320}>
        <Select.ScrollArea contentClassName="select-headless-list">{children}</Select.ScrollArea>
      </Select.Content>
    </Select.Positioner>
  );
}

export function SelectHeadlessPage() {
  const [reason, setReason] = useState("-");
  const [value, setValue] = useState<string[]>([]);
  const [count, setCount] = useState(0);

  function handleOpenChange(open: boolean, details: SelectOpenChangeDetails) {
    "background only";
    setReason(`${open ? "열림" : "닫힘"}: ${details.reason}`);
  }

  function handleUnderlyingTap() {
    "background only";
    setCount((current) => current + 1);
  }

  return (
    <CatalogExamples title="Select (Headless)" gap="24px">
      <text>{`마지막 변경: ${reason}`}</text>
      <text>{`다중 선택 값: ${value.join(", ") || "-"}`}</text>
      <view className="select-headless-underlying" bindtap={handleUnderlyingTap}>
        <text>{`아래 버튼 ${count}`}</text>
      </view>

      <CatalogSectionTitle>View 레이어 · 단일 선택</CatalogSectionTitle>
      <Select.Root defaultValue={["사과"]} onOpenChange={handleOpenChange}>
        <Trigger />
        <Surface>
          <Select.Group>
            <Select.GroupLabel className="select-headless-group-label">과일</Select.GroupLabel>
            <Item value="사과" />
            <Item value="바나나" />
            <Item value="체리(비활성)" disabled />
          </Select.Group>
        </Surface>
      </Select.Root>

      <CatalogSectionTitle>View 레이어 · 긴 목록 · 선택 항목 스크롤</CatalogSectionTitle>
      <Select.Root defaultValue={["항목 25"]} onOpenChange={handleOpenChange}>
        <Trigger />
        <Surface>
          {longList.map((label) => (
            <Item key={label} value={label} />
          ))}
        </Surface>
      </Select.Root>

      <CatalogSectionTitle>View 레이어 · 다중 선택</CatalogSectionTitle>
      <Select.Root multiple value={value} onValueChange={setValue} onOpenChange={handleOpenChange}>
        <Trigger />
        <Surface>
          <Item value="사과" />
          <Item value="바나나" />
          <Item value="체리" />
        </Surface>
      </Select.Root>

      <CatalogSectionTitle>Overlay 레이어(container="window")</CatalogSectionTitle>
      <Select.Root defaultValue={["바나나"]} onOpenChange={handleOpenChange}>
        <Trigger />
        <Surface container="window">
          <Item value="사과" />
          <Item value="바나나" />
        </Surface>
      </Select.Root>
    </CatalogExamples>
  );
}
