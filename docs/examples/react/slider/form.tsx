import { HStack, VStack } from "@seed-design/react";
import { useCallback, useState, type FormEvent } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { Slider } from "seed-design/ui/slider";

type FieldErrors = {
  rating?: string;
  priceRange?: string;
};

export default function SliderForm() {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const rating = Number(formData.get("rating"));
    const priceRangeValues = formData.getAll("price-range").map(Number);

    const newFieldErrors: FieldErrors = {};

    if (rating < 3) {
      newFieldErrors.rating = "평점은 최소 3점 이상이어야 합니다";
    }

    const [min, max] = priceRangeValues;

    if (max - min < 20) {
      newFieldErrors["priceRange"] = "가격 범위는 최소 20만원 이상 차이가 나야 합니다";
    }

    setFieldErrors(newFieldErrors);

    if (Object.keys(newFieldErrors).length > 0) return;

    window.alert(JSON.stringify({ rating, "price-range": priceRangeValues }, null, 2));
  }, []);

  return (
    <VStack asChild gap="x3" width="full">
      <form onSubmit={handleSubmit}>
        <HStack gap="x3">
          <Slider
            label="최소 평점"
            description="원하는 최소 평점을 선택하세요"
            name="rating"
            min={0}
            max={5}
            step={0.5}
            defaultValues={[2.5]}
            markers={[
              { value: 0, label: "0점" },
              { value: 5, label: "5점" },
            ]}
            getValueIndicatorLabel={({ value }) => `${value}점`}
            getAriaValuetext={(value) => `${value}점`}
            showRequiredIndicator
            {...(fieldErrors.rating && {
              invalid: true,
              errorMessage: fieldErrors.rating,
            })}
          />
          <Slider
            label="가격 범위"
            description="원하는 가격 범위를 선택하세요"
            name="price-range"
            min={0}
            max={100}
            defaultValues={[20, 80]}
            markers={[
              { value: 0, label: "0만원" },
              { value: 100, label: "100만원" },
            ]}
            getValueIndicatorLabel={({ value }) => `${value}만원`}
            getAriaValuetext={(value) => `${value}만원`}
            getAriaLabel={(index) => (index === 0 ? "최소 가격" : "최대 가격")}
            showRequiredIndicator
            {...(fieldErrors["priceRange"] && {
              invalid: true,
              errorMessage: fieldErrors["priceRange"],
            })}
          />
        </HStack>
        <ActionButton type="submit" variant="neutralSolid">
          제출
        </ActionButton>
      </form>
    </VStack>
  );
}
