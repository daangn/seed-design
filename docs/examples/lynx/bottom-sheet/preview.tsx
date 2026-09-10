import "./styles";

import { root, useRef, useState } from "@lynx-js/react";
import {
  ActionButton,
  BottomSheet,
  type BottomSheetRootRef,
  useSeedClassName,
  VStack,
} from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const sheetRef = useRef<BottomSheetRootRef>(null);
  const [open, setOpen] = useState(false);

  function handleClose() {
    "background only";
    sheetRef.current?.close();
  }

  return (
    <page className={seedClassName}>
      <VStack className="bottom-sheet-preview" gap="x3">
        <text className="bottom-sheet-preview__status">
          {open ? "열림: true" : "열림: false"}
        </text>
        <BottomSheet.Root ref={sheetRef} onOpenChange={setOpen}>
          <BottomSheet.Trigger>
            <ActionButton variant="neutralSolid">Bottom Sheet 열기</ActionButton>
          </BottomSheet.Trigger>
          <BottomSheet.Positioner>
            <BottomSheet.Backdrop />
            <BottomSheet.Content>
              <BottomSheet.Header>
                <BottomSheet.Title>Bottom Sheet</BottomSheet.Title>
                <BottomSheet.Description>
                  배경을 탭하거나 아래로 밀어서도 닫을 수 있어요.
                </BottomSheet.Description>
              </BottomSheet.Header>
              <BottomSheet.Body className="bottom-sheet-preview__body">
                <text className="bottom-sheet-preview__body-text">본문 콘텐츠</text>
              </BottomSheet.Body>
              <BottomSheet.Footer>
                <ActionButton variant="neutralSolid" bindtap={handleClose}>
                  확인하고 닫기
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
