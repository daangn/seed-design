import { useState } from "@lynx-js/react";
import { Dialog } from "@seed-design/lynx-react-dialog";

import { CatalogExamples, CatalogSectionTitle } from "../components/catalog-examples.jsx";
import "../styles/dialog-headless.css";

function AlertExample({ container }: { container?: Dialog.PositionerProps["container"] }) {
  const [log, setLog] = useState<string[]>([]);

  function handleOpenChange(open: boolean) {
    "background only";
    setLog((current) => [...current.slice(-3), `open:${open}`]);
  }

  return (
    <view className="dialog-headless-section">
      <Dialog.Root onOpenChange={handleOpenChange}>
        <Dialog.Trigger className="dialog-headless-button">
          <text className="dialog-headless-button-text">열기</text>
        </Dialog.Trigger>
        <Dialog.Positioner
          className={container ? "dialog-headless-positioner" : "dialog-headless-positioner-fixed"}
          container={container}
        >
          <Dialog.Backdrop className="dialog-headless-backdrop" clickToClose={false} />
          <Dialog.Content
            className="dialog-headless-content"
            dialogContentProps={{
              "accessibility-element": true,
              "accessibility-role-description": "alertdialog",
            }}
          >
            <Dialog.Title className="dialog-headless-title" accessibility-heading>
              삭제할까요?
            </Dialog.Title>
            <Dialog.Description className="dialog-headless-description">
              배경을 눌러도 닫히지 않아요.
            </Dialog.Description>
            <view className="dialog-headless-actions">
              <Dialog.CloseButton className="dialog-headless-button">
                <text className="dialog-headless-button-text">취소</text>
              </Dialog.CloseButton>
              <Dialog.CloseButton className="dialog-headless-button">
                <text className="dialog-headless-button-text">삭제</text>
              </Dialog.CloseButton>
            </view>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
      <text className="dialog-headless-log">{`log: ${log.join(" → ") || "-"}`}</text>
    </view>
  );
}

export function DialogHeadlessPage() {
  return (
    <CatalogExamples title="Dialog (Headless)" gap="12px">
      <CatalogSectionTitle>Alert 조립 · view 레이어</CatalogSectionTitle>
      <AlertExample />
      <CatalogSectionTitle>Alert 조립 · container="window"</CatalogSectionTitle>
      <AlertExample container="window" />
    </CatalogExamples>
  );
}
