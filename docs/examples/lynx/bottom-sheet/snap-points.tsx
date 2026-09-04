import "./styles";

import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  type BottomSheetRootRef,
  BottomSheetTrigger,
} from "@/components/ui/bottom-sheet";
import { root, useRef, useState } from "@lynx-js/react";
import { ActionButton, HStack, useSeedClassName, VStack } from "@seed-design/lynx-react";

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
        <BottomSheetRoot
          ref={sheetRef}
          snapPoints={snapPoints}
          initialSnap={0}
          onSnapChange={(index) => setSnapIndex(index)}
        >
          <BottomSheetTrigger>
            <ActionButton variant="neutralSolid">Snap Points 열기</ActionButton>
          </BottomSheetTrigger>
          <BottomSheetContent
            title="Snap Points"
            description="핸들을 드래그하거나 버튼을 탭해 높이를 바꿔 보세요."
            showHandle
          >
            <BottomSheetBody className="bottom-sheet-preview__snap-body">
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
            </BottomSheetBody>
            <BottomSheetFooter>
              <ActionButton variant="neutralSolid" bindtap={handleClose}>
                닫기
              </ActionButton>
            </BottomSheetFooter>
          </BottomSheetContent>
        </BottomSheetRoot>
      </VStack>
    </page>
  );
}

root.render(<Root />);
