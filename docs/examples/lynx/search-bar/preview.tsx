import "./styles";

import { useState } from "@lynx-js/react";
import { SearchBar } from "@/components/ui/search-bar";

export default function Example() {
  const [value, setValue] = useState("");
  const [submittedValue, setSubmittedValue] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState("없음");

  function handleSubmit(nextValue: string) {
    "background only";
    setSubmittedValue(nextValue);
  }

  function handleBack() {
    "background only";
    setLastAction("뒤로");
  }

  function handleClose() {
    "background only";
    setLastAction("닫기");
  }

  function handleContentTap() {
    "background only";
    // The screen dismisses the keyboard when its content is tapped; the search input does not.
    lynx
      .createSelectorQuery()
      .select("#search-bar-preview-input")
      .invoke({ method: "blur" })
      .exec();
  }

  return (
    <view className="search-bar-preview">
      <SearchBar
        value={value}
        onValueChange={setValue}
        onSubmit={handleSubmit}
        placeholder="검색어를 입력해주세요"
        onBack={handleBack}
        onClose={handleClose}
        inputProps={{ id: "search-bar-preview-input" }}
      />
      <view className="search-bar-preview__content" bindtap={handleContentTap}>
        <text className="search-bar-preview__status">
          {submittedValue === null ? "검색어를 입력하고 검색해주세요" : `"${submittedValue}" 검색`}
        </text>
        <text className="search-bar-preview__status">마지막 액션: {lastAction}</text>
      </view>
    </view>
  );
}
