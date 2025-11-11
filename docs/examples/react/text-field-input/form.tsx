import { HStack, VStack } from "@seed-design/react";
import { useCallback, useState, type FormEvent } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

type FieldErrors = {
  name?: string;
  address?: string;
};

export default function TextFieldInputForm() {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = formData.get("name")?.toString();
    const address = formData.get("address")?.toString();

    const newFieldErrors: FieldErrors = {};

    if (!name) {
      newFieldErrors.name = "필수 입력 항목입니다";
    }

    if (!address) {
      newFieldErrors.address = "필수 입력 항목입니다";
    }

    if (address && !address.startsWith("대한민국")) {
      newFieldErrors.address = "대한민국으로 시작해주세요";
    }

    setFieldErrors(newFieldErrors);

    if (Object.keys(newFieldErrors).length > 0) return;

    window.alert(JSON.stringify(Object.fromEntries(formData.entries()), null, 2));
  }, []);

  return (
    <VStack asChild gap="x3" width="full">
      <form onSubmit={handleSubmit}>
        <HStack gap="x2">
          <TextField
            label="이름"
            description="이름을 써주세요"
            name="name"
            required
            showRequiredIndicator
            {...(fieldErrors.name && { invalid: true, errorMessage: fieldErrors.name })}
          >
            <TextFieldInput placeholder="홍길동" />
          </TextField>
          <TextField
            label="주소"
            description="주소를 써주세요"
            name="address"
            maxGraphemeCount={30}
            required
            showRequiredIndicator
            {...(fieldErrors.address && { invalid: true, errorMessage: fieldErrors.address })}
          >
            <TextFieldInput placeholder="대한민국" />
          </TextField>
        </HStack>
        <ActionButton type="submit" variant="neutralSolid">
          제출
        </ActionButton>
      </form>
    </VStack>
  );
}
