import { Text, VStack } from "@seed-design/react";
import { useState } from "react";
import { SearchInput } from "seed-design/ui/search-input";

export default function SearchInputSubmit() {
  const [value, setValue] = useState("");
  const [submittedValue, setSubmittedValue] = useState<string | null>(null);

  return (
    <VStack gap="x3" style={{ width: "320px" }}>
      <SearchInput
        value={value}
        onValueChange={setValue}
        onSubmit={setSubmittedValue}
        placeholder="검색어를 입력하고 Enter를 눌러주세요"
      />
      <Text textStyle="t4Regular" color="fg.neutralMuted">
        {submittedValue === null ? "아직 검색하지 않았습니다." : `검색한 값: ${submittedValue}`}
      </Text>
    </VStack>
  );
}
