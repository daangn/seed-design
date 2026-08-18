import { root } from "@lynx-js/react";
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
  return (
    <page className={seedClassName}>
      <view className="bottom-sheet-preview">
        <BottomSheetRoot skipAnimation>
          <BottomSheetTrigger>
            <ActionButton variant="neutralSolid">Open</ActionButton>
          </BottomSheetTrigger>
          <BottomSheetContent title="제목" description="애니메이션 없이 열립니다">
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
