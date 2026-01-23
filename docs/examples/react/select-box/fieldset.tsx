import { ActionButton, HStack, VStack, Box, Text } from "@seed-design/react";
import { useState } from "react";
import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
  RadioSelectBoxItem,
  RadioSelectBoxRadiomark,
  RadioSelectBoxRoot,
} from "seed-design/ui/select-box";

export default function SelectBoxFieldset() {
  const [checkErrors, setCheckErrors] = useState<Record<string, string | undefined>>({});
  const [radioErrorMessage, setRadioErrorMessage] = useState<string | undefined>();

  const handleCheckSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const fruits = formData.getAll("fruit");

    if (fruits.includes("apple")) {
      setCheckErrors({ apple: "Apple은 선택할 수 없습니다." });

      return;
    }

    setCheckErrors({});

    alert(JSON.stringify(fruits, null, 2));
  };

  const handleRadioSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const color = formData.get("color");

    if (color === "red") {
      setRadioErrorMessage("Red는 선택할 수 없습니다.");

      return;
    }

    setRadioErrorMessage(undefined);

    alert(JSON.stringify({ color }, null, 2));
  };

  return (
    <HStack width="full" gap="x8" p="x4" align="flex-start" height="400px">
      <VStack asChild gap="spacingY.componentDefault" style={{ flex: 1 }}>
        <form onSubmit={handleCheckSubmit}>
          <CheckSelectBoxGroup
            label="선호하는 과일을 선택하세요"
            indicator="선택"
            description="Apple을 선택하고 제출해보세요."
            errorMessage={Object.values(checkErrors).filter(Boolean).join(", ")}
          >
            <CheckSelectBox
              defaultChecked
              label="Apple"
              // formData를 위해 설정. controlled 사용 시 불필요
              inputProps={{ name: "fruit", value: "apple" }}
              invalid={!!checkErrors.apple}
              suffix={<CheckSelectBoxCheckmark />}
              footer={
                <Box px="x5" pb="x4">
                  <Text textStyle="t4Medium">
                    Apple을 선택하고 제출하면 에러 메시지가 표시됩니다.
                  </Text>
                </Box>
              }
            />
            <CheckSelectBox
              label="Melon"
              inputProps={{ name: "fruit", value: "melon" }}
              invalid={!!checkErrors.melon}
              suffix={<CheckSelectBoxCheckmark />}
            />
            <CheckSelectBox
              label="Mango"
              inputProps={{ name: "fruit", value: "mango" }}
              invalid={!!checkErrors.mango}
              suffix={<CheckSelectBoxCheckmark />}
            />
          </CheckSelectBoxGroup>
          <ActionButton type="submit" variant="neutralSolid">
            제출
          </ActionButton>
        </form>
      </VStack>

      <VStack asChild gap="spacingY.componentDefault" style={{ flex: 1 }}>
        <form onSubmit={handleRadioSubmit}>
          <RadioSelectBoxRoot
            label="선호하는 색상을 선택하세요"
            labelWeight="bold"
            showRequiredIndicator
            description="Red를 선택하고 제출해보세요."
            name="color"
            defaultValue="red"
            invalid={!!radioErrorMessage}
            errorMessage={radioErrorMessage}
          >
            <RadioSelectBoxItem
              value="red"
              label="Red"
              suffix={<RadioSelectBoxRadiomark />}
              footer={
                <Box px="x5" pb="x4">
                  <Text textStyle="t4Medium">
                    Red를 선택하고 제출하면 에러 메시지가 표시됩니다.
                  </Text>
                </Box>
              }
            />
            <RadioSelectBoxItem
              value="blue"
              label="Blue"
              suffix={<RadioSelectBoxRadiomark />}
              disabled
            />
            <RadioSelectBoxItem value="green" label="Green" suffix={<RadioSelectBoxRadiomark />} />
          </RadioSelectBoxRoot>
          <ActionButton type="submit" variant="neutralSolid">
            제출
          </ActionButton>
        </form>
      </VStack>
    </HStack>
  );
}
