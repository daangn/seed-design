import "./styles";

import IconXmarkCircleFill from "@karrotmarket/lynx-monochrome-icon/IconXmarkCircleFill";
import { Icon, SearchInput } from "@seed-design/lynx-react";

export default function Example() {
  return (
    <view className="search-input-preview">
      <SearchInput.Root>
        <SearchInput.Input accessibility-label="검색" placeholder="검색어를 입력해주세요" />
        <SearchInput.ClearButton accessibility-label="지우기">
          <Icon icon={<IconXmarkCircleFill />} />
        </SearchInput.ClearButton>
      </SearchInput.Root>
    </view>
  );
}
