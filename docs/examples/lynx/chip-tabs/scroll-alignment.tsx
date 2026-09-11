import "./styles";

import { useState } from "@lynx-js/react";
import { ActionButton, Box, HStack, Text, useSeedClassName, VStack } from "@seed-design/lynx-react";
import {
  ChipTabsList,
  ChipTabsRoot,
  ChipTabsTrigger,
  type ChipTabsListProps,
} from "@/components/ui/chip-tabs";

type ScrollAlign = NonNullable<ChipTabsListProps["scrollAlign"]>;

const ALIGNMENTS: ScrollAlign[] = ["nearest", "start", "center", "end"];
const LABELS = Array.from({ length: 15 }, (_, index) => String(index + 1));

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [value, setValue] = useState("1");
  const [scrollAlign, setScrollAlign] = useState<ScrollAlign>("nearest");

  function handleValueChange(nextValue: string) {
    "background only";
    setValue(nextValue);
  }

  function selectScrollAlign(nextScrollAlign: ScrollAlign) {
    "background only";
    setScrollAlign(nextScrollAlign);
    setValue("1");
  }

  function selectSixthChip() {
    "background only";
    setValue("6");
  }

  return (
    <view className={`${seedClassName} docs-lynx-chip-tabs-root chip-tabs-scroll-alignment`}>
      <VStack gap="x3">
        <HStack className="chip-tabs-scroll-alignment__controls" wrap="wrap" gap="x2" p="x4">
          {ALIGNMENTS.map((nextScrollAlign) => (
            <ActionButton
              key={nextScrollAlign}
              className={`chip-tabs-scroll-alignment__mode-button chip-tabs-scroll-alignment__mode-button--${nextScrollAlign}`}
              variant={scrollAlign === nextScrollAlign ? "neutralSolid" : "neutralOutline"}
              bindtap={() => {
                "background only";
                selectScrollAlign(nextScrollAlign);
              }}
            >
              {nextScrollAlign}
            </ActionButton>
          ))}
          <ActionButton
            className="chip-tabs-scroll-alignment__select-sixth-button"
            variant="neutralOutline"
            bindtap={selectSixthChip}
          >
            6번 선택
          </ActionButton>
        </HStack>

        <Box px="x4">
          <Text className="chip-tabs-scroll-alignment__selected-value" textStyle="t5Regular">
            {`선택: 라벨${value}`}
          </Text>
        </Box>

        <Box className="chip-tabs-scroll-alignment__list-frame" width="360px" maxWidth="100%">
          <ChipTabsRoot value={value} onValueChange={handleValueChange}>
            <ChipTabsList scrollAlign={scrollAlign === "nearest" ? undefined : scrollAlign}>
              {LABELS.map((label) => (
                <ChipTabsTrigger key={label} value={label}>
                  {`라벨${label}`}
                </ChipTabsTrigger>
              ))}
            </ChipTabsList>
          </ChipTabsRoot>
        </Box>
      </VStack>
    </view>
  );
}
