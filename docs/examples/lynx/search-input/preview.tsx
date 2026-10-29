import "./styles";

import { SearchInput } from "@/components/ui/search-input";

export default function Example() {
  return (
    <view className="search-input-preview">
      <SearchInput placeholder="검색어를 입력해주세요" />
    </view>
  );
}
