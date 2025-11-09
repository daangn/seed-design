import { HStack, VStack } from "@seed-design/react";
import { useCallback, type FormEvent } from "react";
import { useController, useForm } from "react-hook-form";
import { ActionButton } from "seed-design/ui/action-button";
import { Slider } from "seed-design/ui/slider";

interface FormValues {
  rating: number;
  priceRange: [number, number];
}

export default function SliderReactHookForm() {
  const { handleSubmit, reset, control } = useForm<FormValues>({
    reValidateMode: "onSubmit",
    defaultValues: {
      rating: 2.5,
      priceRange: [20, 80],
    },
  });

  const {
    field: { value: ratingValue, onChange: ratingOnChange, onBlur: __ratingOnBlur, ...ratingField },
    fieldState: ratingFieldState,
  } = useController({
    name: "rating",
    control,
    rules: {
      validate: (value) => value >= 3 || "평점은 최소 3점 이상이어야 합니다",
    },
  });

  const {
    field: {
      value: priceRangeValue,
      onChange: priceRangeOnChange,
      onBlur: __priceRangeOnBlur,
      ...priceRangeField
    },
    fieldState: priceRangeFieldState,
  } = useController({
    name: "priceRange",
    control,
    rules: {
      validate: (value) => {
        const [min, max] = value;

        return max - min >= 20 || "가격 범위는 최소 20만원 이상 차이가 나야 합니다";
      },
    },
  });

  const onValid = useCallback(
    (data: FormValues) => window.alert(JSON.stringify(data, null, 2)),
    [],
  );

  const onReset = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      reset();
    },
    [reset],
  );

  return (
    <VStack gap="x3" width="full" as="form" onSubmit={handleSubmit(onValid)} onReset={onReset}>
      <HStack gap="x3">
        <Slider
          label="최소 평점"
          description="원하는 최소 평점을 선택하세요"
          min={0}
          max={5}
          step={0.5}
          invalid={ratingFieldState.invalid}
          errorMessage={ratingFieldState.error?.message}
          values={[ratingValue]}
          onValuesChange={([values]) => ratingOnChange(values)}
          markers={[
            { value: 0, label: "0점" },
            { value: 5, label: "5점" },
          ]}
          getValueIndicatorLabel={({ value }) => `${value}점`}
          getAriaValuetext={(value) => `${value}점`}
          showRequiredIndicator
          {...ratingField}
        />
        <Slider
          label="가격 범위"
          description="원하는 가격 범위를 선택하세요"
          min={0}
          max={100}
          markers={[
            { value: 0, label: "0만원" },
            { value: 100, label: "100만원" },
          ]}
          invalid={priceRangeFieldState.invalid}
          errorMessage={priceRangeFieldState.error?.message}
          values={priceRangeValue}
          onValuesChange={priceRangeOnChange}
          getValueIndicatorLabel={({ value }) => `${value}만원`}
          getAriaValuetext={(value) => `${value}만원`}
          getAriaLabel={(index) => (index === 0 ? "최소 가격" : "최대 가격")}
          minStepsBetweenThumbs={2}
          showRequiredIndicator
          {...priceRangeField}
        />
      </HStack>
      <HStack gap="x2">
        <ActionButton type="reset" variant="neutralWeak">
          초기화
        </ActionButton>
        <ActionButton type="submit" variant="neutralSolid" flexGrow={1}>
          제출
        </ActionButton>
      </HStack>
    </VStack>
  );
}
