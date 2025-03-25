import { Box, Flex } from "@seed-design/react";
import { Footer } from "common/components/footer";
import { TypographyMigrationProvider, useTypographyMigration } from "./context";
import { TextStylesList } from "./list";
import { Result } from "./result";

export function TypographySection() {
  return (
    <TypographyMigrationProvider>
      <TypographySectionContent />
    </TypographyMigrationProvider>
  );
}

function TypographySectionContent() {
  const { results, applyTextStyle, requestSuggestions } = useTypographyMigration();

  // 자동 연결 가능한 노드 개수 계산
  const remainingConnectableNodeCount = !results
    ? 0
    : results
        .flatMap((group) => group.items)
        .filter(({ suggestions }) => suggestions.length === 1)
        .filter(({ selectedNewTextStyleId }) => selectedNewTextStyleId === null).length;

  // 자동 연결 기능
  function bulkApply() {
    if (!results) return;

    for (const group of results) {
      for (const item of group.items) {
        if (item.suggestions.length !== 1 || item.selectedNewTextStyleId) continue;

        applyTextStyle({
          textNodeIds: [item.textNode.id],
          textStyleId: item.suggestions[0].textStyle.id,
        });
      }
    }
  }

  return (
    <Flex direction="column" style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* 메인 컨텐츠 영역 - 좌우 분리 */}
      <Flex flexGrow={1} style={{ overflow: "hidden", height: "calc(100% - 60px)" }}>
        {/* 왼쪽 사이드바 */}
        <Box
          width="40%"
          borderRightWidth={1}
          borderColor="palette.gray200"
          style={{
            overflow: "auto",
            height: "100%",
          }}
        >
          <TextStylesList />
        </Box>

        {/* 오른쪽 상세 내용 */}
        <Box width="60%" style={{ overflow: "auto", height: "100%" }}>
          <Result />
        </Box>
      </Flex>

      {/* 하단 고정 액션 버튼 */}
      <Footer
        actionText={`${remainingConnectableNodeCount}개 자동 연결`}
        onAction={bulkApply}
        actionDisabled={remainingConnectableNodeCount === 0}
        actionTooltip="추천 텍스트 스타일이 1개인 항목에 자동으로 추천을 적용합니다. 추천이 없거나 2개 이상인 항목은 변경되지 않습니다."
        onRefresh={requestSuggestions}
        showRefreshButton={true}
      />
    </Flex>
  );
}
