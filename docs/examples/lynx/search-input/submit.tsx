import "./styles";

import { useState } from "@lynx-js/react";
import { SearchInput } from "@/components/ui/search-input";

export default function Example() {
  const [value, setValue] = useState("");
  const [submittedValue, setSubmittedValue] = useState<string | null>(null);

  function handleSubmit(nextValue: string) {
    "background only";
    setSubmittedValue(nextValue);
  }

  return (
    <view className="search-input-preview">
      <SearchInput
        value={value}
        onValueChange={setValue}
        onSubmit={handleSubmit}
        placeholder="검색어를 입력하고 검색 키를 눌러주세요"
      />
      <text className="search-input-preview__status">
        {submittedValue === null ? "아직 검색하지 않았습니다." : `검색한 값: ${submittedValue}`}
      </text>
    </view>
  );
}
