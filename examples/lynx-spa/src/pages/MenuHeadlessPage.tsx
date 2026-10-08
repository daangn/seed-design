import { useState } from "@lynx-js/react";
import type { ReactNode } from "@lynx-js/react";
import { Menu, useMenuItemContext, type MenuOpenChangeDetails } from "@seed-design/lynx-react-menu";

import { CatalogExamples, CatalogSectionTitle } from "../components/catalog-examples.jsx";
import "../styles/menu-headless.css";

const longList = Array.from({ length: 30 }, (_, index) => `항목 ${index + 1}`);

function ItemLabel({ children }: { children: string }) {
  const { disabled, pressed } = useMenuItemContext();
  const className = disabled
    ? "menu-headless-label menu-headless-label-disabled"
    : "menu-headless-label";

  return (
    <view
      className={
        pressed ? "menu-headless-item-body menu-headless-pressed" : "menu-headless-item-body"
      }
    >
      <text className={className}>{children}</text>
    </view>
  );
}

function Item({ label, disabled }: { label: string; disabled?: boolean }) {
  return (
    <Menu.Item disabled={disabled} accessibility-label={label}>
      <ItemLabel>{label}</ItemLabel>
    </Menu.Item>
  );
}

/** Content 안의 scroll-view가 Content의 maxHeight를 넘으면 스크롤한다. */
function Surface({ children, ...positionerProps }: Menu.PositionerProps & { children: ReactNode }) {
  return (
    <Menu.Positioner className="menu-headless-positioner" {...positionerProps}>
      <Menu.Content className="menu-headless-content">
        <scroll-view className="menu-headless-scroll" scroll-orientation="vertical">
          <view className="menu-headless-list">{children}</view>
        </scroll-view>
      </Menu.Content>
    </Menu.Positioner>
  );
}

function Trigger({ children }: { children: string }) {
  return (
    <Menu.Trigger className="menu-headless-trigger" accessibility-label={children}>
      <text className="menu-headless-trigger-label">{children}</text>
    </Menu.Trigger>
  );
}

export function MenuHeadlessPage() {
  const [reason, setReason] = useState("-");
  const [count, setCount] = useState(0);

  function handleOpenChange(open: boolean, details: MenuOpenChangeDetails) {
    "background only";
    setReason(`${open ? "열림" : "닫힘"}: ${details.reason}`);
  }

  function handleUnderlyingTap() {
    "background only";
    setCount((current) => current + 1);
  }

  return (
    <CatalogExamples title="Menu (Headless)" gap="24px">
      <text>{`마지막 변경: ${reason}`}</text>
      <view className="menu-headless-underlying" bindtap={handleUnderlyingTap}>
        <text>{`아래 버튼 ${count}`}</text>
      </view>

      <CatalogSectionTitle>View 레이어 · 짧은 목록</CatalogSectionTitle>
      <Menu.Root onOpenChange={handleOpenChange}>
        <Trigger>짧은 목록 열기</Trigger>
        <Surface>
          <Menu.Group>
            <Menu.GroupLabel className="menu-headless-group-label">작업</Menu.GroupLabel>
            <Item label="추가" />
            <Item label="수정" />
            <Item label="삭제(비활성)" disabled />
          </Menu.Group>
        </Surface>
      </Menu.Root>

      <CatalogSectionTitle>View 레이어 · 긴 목록</CatalogSectionTitle>
      <Menu.Root onOpenChange={handleOpenChange}>
        <Trigger>긴 목록 열기</Trigger>
        <Surface>
          {longList.map((label) => (
            <Item key={label} label={label} />
          ))}
        </Surface>
      </Menu.Root>

      <CatalogSectionTitle>Overlay 레이어(container="window")</CatalogSectionTitle>
      <Menu.Root onOpenChange={handleOpenChange} matchReferenceWidth>
        <Trigger>window에 열기</Trigger>
        <Surface container="window">
          <Item label="추가" />
          <Item label="수정" />
        </Surface>
      </Menu.Root>
    </CatalogExamples>
  );
}
