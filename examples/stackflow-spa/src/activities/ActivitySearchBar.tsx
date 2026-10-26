import { useState } from "react";
import { Flex, Text } from "@seed-design/react";
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
  const [value, setValue] = useState("");
  const [submittedValue, setSubmittedValue] = useState<string | null>(null);

  return (
    <AppScreen>
      <SearchBar
        value={value}
        onValueChange={setValue}
        onSubmit={setSubmittedValue}
        placeholder="검색어를 입력해주세요"
        showBackButton
        onClose={() => pop()}
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
          <Text color="fg.neutralMuted">
            {submittedValue === null
              ? "검색어를 입력하고 검색해주세요"
              : `"${submittedValue}" 검색`}
          </Text>
        </Flex>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivitySearchBar;
