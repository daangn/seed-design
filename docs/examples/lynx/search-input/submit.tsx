import "./styles";

import IconXmarkCircleFill from "@karrotmarket/lynx-monochrome-icon/IconXmarkCircleFill";
import { useState } from "@lynx-js/react";
import { Icon, SearchInput } from "@seed-design/lynx-react";

export default function Example() {
  const [value, setValue] = useState("");
  const [submittedValue, setSubmittedValue] = useState<string | null>(null);

  function handleSubmit(nextValue: string) {
    "background only";
    setSubmittedValue(nextValue);
  }

  return (
    <view className="search-input-preview">
      <SearchInput.Root value={value} onValueChange={setValue} onSubmit={handleSubmit}>
        <SearchInput.Input
          accessibility-label="검색"
          placeholder="검색어를 입력하고 검색 키를 눌러주세요"
        />
        <SearchInput.ClearButton accessibility-label="지우기">
          <Icon icon={<IconXmarkCircleFill />} />
        </SearchInput.ClearButton>
      </SearchInput.Root>
      <text className="search-input-preview__status">
        {submittedValue === null ? "아직 검색하지 않았습니다." : `검색한 값: ${submittedValue}`}
      </text>
    </view>
  );
}
