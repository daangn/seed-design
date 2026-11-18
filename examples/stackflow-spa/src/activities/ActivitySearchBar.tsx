import { useState } from "react";
import { Flex, Text } from "@seed-design/react";
import { useActivity } from "@stackflow/react";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { SearchBar } from "seed-design/ui/search-bar";

declare module "@stackflow/config" {
  interface Register {
    ActivitySearchBar: {};
  }
}

const ActivitySearchBar: StaticActivityComponentType<"ActivitySearchBar"> = () => {
  const { pop } = useFlow();
  const { isRoot } = useActivity();
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("검색어를 입력하고 검색해주세요");

  return (
    <AppScreen>
      <SearchBar
        value={value}
        onValueChange={setValue}
        onSubmit={(submittedValue) => setMessage(`"${submittedValue}" 검색`)}
        placeholder="검색어를 입력해주세요"
        showBackButton
        // The root activity has nowhere to pop to, so it shows the action instead.
        onClose={() => (isRoot ? setMessage("닫기를 눌렀습니다") : pop())}
      />
      <AppScreenContent>
        <Flex
          justify="center"
          align="center"
          height="full"
          // The screen dismisses the keyboard when its content is touched; the search input does not.
          onPointerDown={() => {
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement.blur();
            }
          }}
        >
          <Text color="fg.neutralMuted">{message}</Text>
        </Flex>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivitySearchBar;
