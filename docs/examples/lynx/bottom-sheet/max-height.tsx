import { root } from "@lynx-js/react";
import { ActionButton, VStack, useSeedClassName } from "@seed-design/lynx-react";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "@/components/ui/bottom-sheet";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <view className="bottom-sheet-preview">
        <BottomSheetRoot handleOnly>
          <BottomSheetTrigger>
            <ActionButton variant="neutralSolid">Open</ActionButton>
          </BottomSheetTrigger>
          <BottomSheetContent title="제목" description="설명을 작성할 수 있어요" showHandle>
            <BottomSheetBody>
              <scroll-view scroll-orientation="vertical" className="bottom-sheet-preview__scroll">
                <VStack gap="x4">
                  <view className="bottom-sheet-preview__block" />
                  <view className="bottom-sheet-preview__block" />
                  <view className="bottom-sheet-preview__block" />
                  <view className="bottom-sheet-preview__block" />
                </VStack>
              </scroll-view>
            </BottomSheetBody>
          </BottomSheetContent>
        </BottomSheetRoot>
      </view>
    </page>
  );
}
root.render(<Root />);
