import { IconXmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import { Icon, SearchInput, Text, VStack } from "@seed-design/react";
import { useState } from "react";

export default function SearchInputSubmit() {
  const [value, setValue] = useState("");
  const [submittedValue, setSubmittedValue] = useState<string | null>(null);

  return (
    <VStack gap="x3" style={{ width: "320px" }}>
      <SearchInput.Root value={value} onValueChange={setValue} onSubmit={setSubmittedValue}>
        <SearchInput.Input aria-label="검색" placeholder="검색어를 입력하고 Enter를 눌러주세요" />
        <SearchInput.ClearButton aria-label="지우기">
          <Icon svg={<IconXmarkCircleFill />} />
        </SearchInput.ClearButton>
      </SearchInput.Root>
      <Text textStyle="t4Regular" color="fg.neutralMuted">
        {submittedValue === null ? "아직 검색하지 않았습니다." : `검색한 값: ${submittedValue}`}
      </Text>
    </VStack>
  );
}
