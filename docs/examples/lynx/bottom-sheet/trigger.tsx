import "./styles";

import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "@/components/ui/bottom-sheet";
import { root } from "@lynx-js/react";
import { ActionButton, useSeedClassName, VStack } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack className="bottom-sheet-preview">
        <BottomSheetRoot>
          <BottomSheetTrigger>
            <ActionButton variant="neutralSolid">Open</ActionButton>
          </BottomSheetTrigger>
          <BottomSheetContent title="제목">
            <BottomSheetBody className="bottom-sheet-preview__body">
              <text className="bottom-sheet-preview__body-text">Content</text>
            </BottomSheetBody>
            <BottomSheetFooter>
              <ActionButton variant="neutralSolid">확인</ActionButton>
            </BottomSheetFooter>
          </BottomSheetContent>
        </BottomSheetRoot>
      </VStack>
    </page>
  );
}

root.render(<Root />);
