import { Flex } from "@seed-design/react";
import { Footer } from "common/components/footer";
import { useComponentSection } from "./context";
import { ComponentSuggestionsList } from "./list";

export function ComponentSection() {
  const { swapAllComponents, selectedVariants, migrationTargets } = useComponentSection();

  return (
    <Flex direction="column" style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* 메인 컨텐츠 영역 - 좌우 분리 */}
      <Flex flexGrow={1} style={{ overflow: "hidden", height: "calc(100% - 60px)" }}>
        <ComponentSuggestionsList />
      </Flex>

      {/* 하단 고정 액션 버튼 */}
      <Footer
        actionText={`${migrationTargets.length}개 자동 연결`}
        onAction={() => swapAllComponents(migrationTargets, selectedVariants)}
        actionDisabled={migrationTargets.length === 0}
        showRefreshButton={true}
      />
    </Flex>
  );
}
