import {
  AppBar,
  AppBarBackButton,
  AppBarIconButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { ActionButton } from "seed-design/ui/action-button";
import { QuantityPicker } from "seed-design/ui/quantity-picker";
import { Field, HStack, PrefixIcon, Text, VStack } from "@seed-design/react";
import { IconExclamationmarkCircleFill, IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import * as React from "react";

declare module "@stackflow/config" {
  interface Register {
    ActivityQuantityPicker: {};
  }
}

interface QuantityPickerCaseProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function QuantityPickerCase({ title, description, children }: QuantityPickerCaseProps) {
  return (
    <VStack gap="x2" align="flex-start">
      <VStack gap="x0_5">
        <Text textStyle="t4Bold">{title}</Text>
        <Text textStyle="t5Regular" color="fg.neutralWeak">
          {description}
        </Text>
      </VStack>
      {children}
    </VStack>
  );
}

const ActivityQuantityPicker: StaticActivityComponentType<"ActivityQuantityPicker"> = () => {
  const { push } = useFlow();
  const [controlledValue, setControlledValue] = React.useState(2);
  const [fieldValue, setFieldValue] = React.useState(10);
  const [removableValue, setRemovableValue] = React.useState(1);
  const [isRemoved, setIsRemoved] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [submittedValue, setSubmittedValue] = React.useState<number | null>(null);
  const isFieldValueInvalid = fieldValue === 11;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    setSubmittedValue(Number(formData.get("quantity")));
  }

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Quantity Picker</AppBarMain>
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <VStack gap="x6" px="spacingX.globalGutter" py="x4">
          <QuantityPickerCase
            title="범위 경계와 자릿수"
            description="최솟값·중간값·최댓값에서 action 상태와 값 표시 너비를 확인합니다."
          >
            <HStack gap="x3" align="center" wrap="wrap">
              <QuantityPicker
                min={1}
                max={999}
                defaultValue={1}
                aria-label="최소 수량"
                getValueText={(value) => `${value}개`}
              />
              <QuantityPicker
                min={1}
                max={999}
                defaultValue={10}
                aria-label="중간 수량"
                getValueText={(value) => `${value}개`}
              />
              <QuantityPicker
                min={1}
                max={999}
                defaultValue={999}
                aria-label="최대 수량"
                getValueText={(value) => `${value}개`}
              />
            </HStack>
          </QuantityPickerCase>

          <QuantityPickerCase
            title="제어 상태와 step"
            description="외부 상태 동기화와 step 단위 증감 동작을 확인합니다."
          >
            <HStack gap="x3" align="center" wrap="wrap">
              <QuantityPicker
                min={1}
                max={99}
                step={5}
                value={controlledValue}
                onValueChange={setControlledValue}
                aria-label="제어되는 수량"
                getValueText={(value) => `${value}개`}
              />
              <Text textStyle="t4Regular">현재 수량: {controlledValue}개</Text>
            </HStack>
          </QuantityPickerCase>

          <QuantityPickerCase
            title="Removable"
            description="최소 수량에서 Decrement 버튼이 Remove 버튼으로 전환되는지 확인합니다."
          >
            {isRemoved ? (
              <HStack gap="x3" align="center">
                <Text textStyle="t4Regular">상품을 삭제했습니다.</Text>
                <ActionButton
                  variant="neutralWeak"
                  onClick={() => {
                    setRemovableValue(1);
                    setIsRemoved(false);
                  }}
                >
                  다시 추가
                </ActionButton>
              </HStack>
            ) : (
              <QuantityPicker
                min={1}
                max={99}
                value={removableValue}
                onValueChange={setRemovableValue}
                removable
                removeAriaLabel="상품 삭제"
                onRemove={() => setIsRemoved(true)}
                aria-label="삭제 가능한 수량"
                getValueText={(value) => `${value}개`}
              />
            )}
          </QuantityPickerCase>

          <QuantityPickerCase
            title="Loading"
            description="버튼으로 전체 action과 Increment action의 loading 상태를 각각 확인합니다."
          >
            <HStack gap="x3" align="center" wrap="wrap">
              <ActionButton variant="neutralWeak" onClick={() => setIsLoading((value) => !value)}>
                {isLoading ? "로딩 해제" : "로딩 시작"}
              </ActionButton>
              <QuantityPicker
                min={1}
                max={99}
                defaultValue={2}
                loading={isLoading}
                aria-label="전체 로딩 수량"
                getValueText={(value) => `${value}개`}
              />
              <QuantityPicker
                min={1}
                max={99}
                defaultValue={2}
                loading={{ increment: isLoading }}
                aria-label="증가 로딩 수량"
                getValueText={(value) => `${value}개`}
              />
            </HStack>
          </QuantityPickerCase>

          <QuantityPickerCase
            title="상태"
            description="disabled, readOnly, invalid 상태의 시각적·상호작용 차이를 확인합니다."
          >
            <HStack gap="x3" align="center" wrap="wrap">
              <QuantityPicker
                min={1}
                max={99}
                defaultValue={2}
                disabled
                aria-label="비활성 수량"
                getValueText={(value) => `${value}개`}
              />
              <QuantityPicker
                min={1}
                max={99}
                defaultValue={2}
                readOnly
                aria-label="읽기 전용 수량"
                getValueText={(value) => `${value}개`}
              />
              <QuantityPicker
                min={1}
                max={99}
                defaultValue={2}
                invalid
                aria-label="오류 수량"
                getValueText={(value) => `${value}개`}
              />
            </HStack>
          </QuantityPickerCase>

          <QuantityPickerCase
            title="Field 통합"
            description="11개를 선택하면 Field와 Quantity Picker에 오류 상태를 함께 표시합니다."
          >
            <Field.Root required invalid={isFieldValueInvalid}>
              <Field.Header>
                <Field.Label>
                  구매 수량
                  <Field.RequiredIndicator />
                </Field.Label>
              </Field.Header>
              <QuantityPicker
                min={1}
                max={99}
                value={fieldValue}
                onValueChange={setFieldValue}
                invalid={isFieldValueInvalid}
                aria-label="구매 수량"
                getValueText={(value) => `${value}개`}
              />
              <Field.Footer>
                {isFieldValueInvalid ? (
                  <Field.ErrorMessage>
                    <PrefixIcon svg={<IconExclamationmarkCircleFill />} />
                    11개는 구매할 수 없어요.
                  </Field.ErrorMessage>
                ) : (
                  <Field.Description>11개를 제외한 수량을 선택할 수 있습니다.</Field.Description>
                )}
              </Field.Footer>
            </Field.Root>
          </QuantityPickerCase>

          <QuantityPickerCase
            title="Form"
            description="Hidden input이 현재 수량을 form data로 제출하는지 확인합니다."
          >
            <VStack asChild gap="x3" align="flex-start">
              <form onSubmit={handleSubmit}>
                <QuantityPicker
                  min={1}
                  max={99}
                  defaultValue={2}
                  aria-label="제출할 수량"
                  inputProps={{ name: "quantity" }}
                  getValueText={(value) => `${value}개`}
                />
                <HStack gap="x3" align="center">
                  <ActionButton type="submit" variant="neutralSolid">
                    제출
                  </ActionButton>
                  {submittedValue !== null && (
                    <Text textStyle="t4Regular">제출한 수량: {submittedValue}개</Text>
                  )}
                </HStack>
              </form>
            </VStack>
          </QuantityPickerCase>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityQuantityPicker;
