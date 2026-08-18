import { root } from "@lynx-js/react";
import { ActionButton, HStack, useSeedClassName } from "@seed-design/lynx-react";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "@/components/ui/bottom-sheet";
import "./styles";

function Sheet({ align, label }: { align: "left" | "center"; label: string }) {
  return (
    <BottomSheetRoot headerAlign={align}>
      <BottomSheetTrigger>
        <ActionButton variant="neutralSolid">{label}</ActionButton>
      </BottomSheetTrigger>
      <BottomSheetContent title="제목" description="설명을 작성할 수 있어요">
        <BottomSheetBody className="bottom-sheet-preview__body">
          <text>Content</text>
        </BottomSheetBody>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
}
function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <HStack className="bottom-sheet-preview" gap="x4">
        <Sheet align="left" label="Left (기본값)" />
        <Sheet align="center" label="Center" />
      </HStack>
    </page>
  );
}
root.render(<Root />);
