import { VStack } from "@seed-design/react";
import { RadioGroup } from "@seed-design/react/primitive";
import { useActivity, useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from "seed-design/ui/bottom-sheet";
import { List, ListRadioItem } from "seed-design/ui/list";
import { Radiomark } from "seed-design/ui/radio-group";
import { useActivityZIndexBase } from "@seed-design/stackflow";
import { useState } from "react";
import { send } from "@stackflow/compat-await-push";

declare module "@stackflow/config" {
  interface Register {
    ActivityCategorySheet: {
      defaultValue?: string;
    };
  }
}

const categories = [
  { value: "electronics", label: "전자기기" },
  { value: "fashion", label: "패션/의류" },
  { value: "food", label: "식품/음료" },
  { value: "home", label: "가구/인테리어" },
  { value: "sports", label: "스포츠/레저" },
  { value: "beauty", label: "뷰티/미용" },
  { value: "books", label: "도서/음반" },
  { value: "toys", label: "완구/취미" },
  { value: "pet", label: "반려동물용품" },
  { value: "baby", label: "유아동" },
  { value: "digital", label: "디지털/가전" },
  { value: "car", label: "자동차용품" },
  { value: "office", label: "문구/오피스" },
  { value: "health", label: "건강/의료" },
  { value: "travel", label: "여행/티켓" },
  { value: "kitchen", label: "주방용품" },
  { value: "garden", label: "정원/원예" },
  { value: "music", label: "악기/음향" },
  { value: "art", label: "미술/공예" },
  { value: "jewelry", label: "쥬얼리/시계" },
  { value: "camping", label: "캠핑/아웃도어" },
  { value: "fishing", label: "낚시용품" },
  { value: "golf", label: "골프" },
  { value: "cycling", label: "자전거" },
  { value: "game", label: "게임/콘솔" },
  { value: "collectibles", label: "수집품/굿즈" },
  { value: "handmade", label: "핸드메이드" },
  { value: "vintage", label: "빈티지/앤틱" },
  { value: "rental", label: "대여서비스" },
  { value: "etc", label: "기타" },
];

const ActivityCategorySheet: StaticActivityComponentType<"ActivityCategorySheet"> = ({
  params,
}) => {
  const { pop } = useFlow();
  const activity = useActivity();
  const [selected, setSelected] = useState<string | undefined>(params.defaultValue);

  const handleConfirm = () => {
    if (selected) {
      const selectedCategory = categories.find((c) => c.value === selected);
      send({ activityId: activity.id, data: { value: selected, label: selectedCategory?.label } });
    }
    pop();
  };

  return (
    <BottomSheetRoot open={activity.isActive} onOpenChange={(open) => !open && pop()}>
      <BottomSheetContent showHandle title="카테고리 선택" layerIndex={useActivityZIndexBase()}>
        <BottomSheetBody paddingX={0}>
          <VStack maxHeight="400px" overflowY="auto">
            <List asChild>
              <RadioGroup.Root
                value={selected}
                onValueChange={setSelected}
                aria-label="카테고리 선택"
              >
                {categories.map((category) => (
                  <ListRadioItem
                    key={category.value}
                    value={category.value}
                    title={category.label}
                    prefix={<Radiomark size="large" tone="neutral" />}
                  />
                ))}
              </RadioGroup.Root>
            </List>
          </VStack>
        </BottomSheetBody>
        <BottomSheetFooter>
          <VStack gap="x2">
            <ActionButton
              size="large"
              variant="neutralSolid"
              onClick={handleConfirm}
              disabled={!selected}
            >
              완료
            </ActionButton>
          </VStack>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
};

export default ActivityCategorySheet;
