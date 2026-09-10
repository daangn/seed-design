import "./styles";

import { root, useRef, useState } from "@lynx-js/react";
import {
  ActionButton,
  BottomSheet,
  type BottomSheetRootRef,
  HStack,
  useSeedClassName,
  VStack,
} from "@seed-design/lynx-react";

const snapPoints = ["45%", "80%"];

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const sheetRef = useRef<BottomSheetRootRef>(null);
  const [snapIndex, setSnapIndex] = useState(0);

  function handleSnapToFirst() {
    "background only";
    sheetRef.current?.snapTo(0);
  }

  function handleSnapToSecond() {
    "background only";
    sheetRef.current?.snapTo(1);
  }

  function handleClose() {
    "background only";
    sheetRef.current?.close();
  }

  return (
    <page className={seedClassName}>
      <VStack className="bottom-sheet-preview" gap="x3">
        <text className="bottom-sheet-preview__status">
          snap index: {JSON.stringify(snapIndex)}
        </text>
        <BottomSheet.Root
          ref={sheetRef}
          snapPoints={snapPoints}
          initialSnap={0}
          onSnapChange={(index) => setSnapIndex(index)}
        >
          <BottomSheet.Trigger>
            <ActionButton variant="neutralSolid">Snap Points 열기</ActionButton>
          </BottomSheet.Trigger>
          <BottomSheet.Positioner>
            <BottomSheet.Backdrop />
            <BottomSheet.Content>
              <BottomSheet.Handle />
              <BottomSheet.Header>
                <BottomSheet.Title>Snap Points</BottomSheet.Title>
                <BottomSheet.Description>
                  핸들을 드래그하거나 버튼을 탭해 높이를 바꿔 보세요.
                </BottomSheet.Description>
              </BottomSheet.Header>
              <BottomSheet.Body className="bottom-sheet-preview__snap-body">
                <text className="bottom-sheet-preview__body-text">
                  현재 snap index: {JSON.stringify(snapIndex)}
                </text>
                <HStack gap="x2">
                  <ActionButton flexGrow={1} variant="neutralWeak" bindtap={handleSnapToFirst}>
                    45%
                  </ActionButton>
                  <ActionButton flexGrow={1} variant="neutralWeak" bindtap={handleSnapToSecond}>
                    80%
                  </ActionButton>
                </HStack>
              </BottomSheet.Body>
              <BottomSheet.Footer>
                <ActionButton variant="neutralSolid" bindtap={handleClose}>
                  닫기
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
