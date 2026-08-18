import { root, useState } from "@lynx-js/react";
import { ActionButton, useSeedClassName } from "@seed-design/lynx-react";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "@/components/ui/bottom-sheet";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [snapIndex, setSnapIndex] = useState(0);
  return (
    <page className={seedClassName}>
      <view className="bottom-sheet-preview">
        <BottomSheetRoot
          snapPoints={[300, 500, "90%"]}
          initialSnap={0}
          onSnapChange={(index) => setSnapIndex(index)}
        >
          <BottomSheetTrigger>
            <ActionButton variant="neutralSolid">Open</ActionButton>
          </BottomSheetTrigger>
          <BottomSheetContent
            title={`현재 snap: ${snapIndex}`}
            description="핸들을 드래그해 높이를 바꿔보세요"
            showHandle
          >
            <BottomSheetBody className="bottom-sheet-preview__body">
              <text>Content</text>
            </BottomSheetBody>
          </BottomSheetContent>
        </BottomSheetRoot>
      </view>
    </page>
  );
}
root.render(<Root />);
