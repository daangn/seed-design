import { VStack, HStack } from "@seed-design/react";
import { FieldButton, FieldButtonValue } from "seed-design/ui/field-button";
import { ActionButton } from "seed-design/ui/action-button";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";
import { useState, type FormEvent } from "react";

export default function FieldButtonForm() {
  const [count, setCount] = useState(0);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    window.alert(JSON.stringify(Object.fromEntries(formData.entries()), null, 2));
  };

  return (
    <VStack asChild width="full" gap="spacingY.componentDefault">
      <form onSubmit={handleSubmit}>
        <HStack gap="x3">
          <TextField
            label="TextField"
            description="이것은 TextField입니다. FieldButton과 어떻게 다른지 비교해보세요."
            name="text-field-text"
          >
            <TextFieldInput placeholder="TextFieldInput" />
          </TextField>
          <FieldButton
            label="input을 포함한 FieldButton"
            description={`이 FieldButton은 <input type="hidden" /> 요소를 한 개 포함하고 있습니다. 자세한 내용은 예시 코드를 참고하세요.`}
            name="field-button-count"
            values={[`${count}`]}
            buttonProps={{
              onClick: () => setCount((prev) => prev + 1),
              "aria-label": "카운트 증가",
            }}
          >
            <FieldButtonValue>현재 카운트: {count}</FieldButtonValue>
          </FieldButton>
        </HStack>
        <ActionButton type="submit" variant="neutralSolid">
          제출
        </ActionButton>
      </form>
    </VStack>
  );
}
