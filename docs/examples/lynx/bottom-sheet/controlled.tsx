import "./styles";

import { root, useState } from "@lynx-js/react";
import { ActionButton, BottomSheet, useSeedClassName, VStack } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [open, setOpen] = useState(false);

  function handleOpen() {
    "background only";
    setOpen(true);
  }

  function handleClose() {
    "background only";
    setOpen(false);
  }

  return (
    <page className={seedClassName}>
      <VStack className="bottom-sheet-preview" gap="x3">
        <text className="bottom-sheet-preview__status">
          {open ? "open: true" : "open: false"}
        </text>
        <ActionButton variant="neutralSolid" bindtap={handleOpen} disabled={open}>
          상태로 열기
        </ActionButton>
        <BottomSheet.Root open={open} onOpenChange={setOpen}>
          <BottomSheet.Positioner>
            <BottomSheet.Backdrop />
            <BottomSheet.Content>
              <BottomSheet.Header>
                <BottomSheet.Title>Controlled Bottom Sheet</BottomSheet.Title>
                <BottomSheet.Description>
                  open 값과 onOpenChange로 열린 상태를 제어합니다.
                </BottomSheet.Description>
              </BottomSheet.Header>
              <BottomSheet.Body className="bottom-sheet-preview__body">
                <text className="bottom-sheet-preview__body-text">
                  {open ? "현재 open: true" : "현재 open: false"}
                </text>
              </BottomSheet.Body>
              <BottomSheet.Footer>
                <ActionButton variant="neutralSolid" bindtap={handleClose}>
                  상태로 닫기
                </ActionButton>
              </BottomSheet.Footer>
            </BottomSheet.Content>
          </BottomSheet.Positioner>
        </BottomSheet.Root>
      </VStack>
    </page>
  );
}

root.render(<Root />);
