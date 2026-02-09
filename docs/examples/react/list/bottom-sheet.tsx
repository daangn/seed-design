import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "seed-design/ui/bottom-sheet";
import { ActionButton } from "seed-design/ui/action-button";
import { Checkmark } from "seed-design/ui/checkbox";
import { List, ListCheckItem } from "seed-design/ui/list";
import { PrefixIcon, VStack } from "@seed-design/react";
import { useState } from "react";
import { IconArrowClockwiseCircularFill } from "@karrotmarket/react-monochrome-icon";

const TYPES = ["버스", "지하철", "택시", "자전거", "도보"] as const;

export default function ListBottomSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<(typeof TYPES)[number][]>([]);

  return (
    <BottomSheetRoot open={isOpen} onOpenChange={setIsOpen}>
      <BottomSheetTrigger asChild>
        <ActionButton variant="neutralSolid">BottomSheet 열기</ActionButton>
      </BottomSheetTrigger>
      <BottomSheetContent title="교통수단" description="이동할 교통수단을 선택해주세요.">
        <VStack asChild>
          <form
            onReset={(e) => {
              e.preventDefault();
              setSelectedTypes([]);
            }}
            onSubmit={(e) => {
              e.preventDefault();
              setIsOpen(false);
            }}
          >
            <BottomSheetBody paddingX="0" asChild>
              <List as="fieldset">
                {TYPES.map((type) => (
                  <ListCheckItem
                    key={type}
                    title={type}
                    checked={selectedTypes.includes(type)}
                    prefix={<Checkmark tone="neutral" size="large" />}
                    onCheckedChange={() => {
                      setSelectedTypes((prev) =>
                        prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
                      );
                    }}
                  />
                ))}
              </List>
            </BottomSheetBody>
            <BottomSheetFooter>
              <VStack gap="x2">
                <ActionButton
                  size="large"
                  variant="neutralSolid"
                  disabled={selectedTypes.length === 0}
                  type="submit"
                >
                  경로 찾기
                </ActionButton>
                <ActionButton
                  size="small"
                  variant="ghost"
                  disabled={selectedTypes.length === 0}
                  type="reset"
                >
                  <PrefixIcon svg={<IconArrowClockwiseCircularFill />} />
                  초기화
                </ActionButton>
              </VStack>
            </BottomSheetFooter>
          </form>
        </VStack>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
}
