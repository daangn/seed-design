import { Box, Flex } from "@seed-design/react";
import { Footer } from "common/components/footer";
import { SEED_V3_LIBRARY_VARIABLE_PREFIXES } from "shared/constants";
import { ColorMigrationProvider, useColorMigration } from "./context";
import { LayersWithColorList } from "./list";
import { Result } from "./result";

export function ColorsSection() {
  return (
    <ColorMigrationProvider>
      <ColorsSectionContent />
    </ColorMigrationProvider>
  );
}

function ColorsSectionContent() {
  const { results, applyColorVariable, requestSuggestions } = useColorMigration();

  // 자동 연결 가능한 노드 개수 계산
  const remainingConnectableNodeCount = !results
    ? 0
    : results
        .filter(({ oldValue, suggestions }) => {
          if (suggestions.length === 1) return true;

          // V2 컴포넌트도 컬러 검사 옵션이 *꺼져* 있는 경우에는
          // gray-900 -> gray-1000 + 시맨틱 토큰 조합에서 추천 2+인 경우에도 자동 연결 (시맨틱으로 연결)
          if (oldValue.type === "style" && oldValue.style.name.endsWith("gray-900")) {
            const semanticSuggestions = suggestions.filter(
              ({ variable: { name } }) =>
                name.startsWith(SEED_V3_LIBRARY_VARIABLE_PREFIXES.COLOR.BG) ||
                name.startsWith(SEED_V3_LIBRARY_VARIABLE_PREFIXES.COLOR.FG) ||
                name.startsWith(SEED_V3_LIBRARY_VARIABLE_PREFIXES.COLOR.STROKE),
            );

            return semanticSuggestions.length === 1;
          }

          return false;
        })
        .flatMap(({ consumers }) => consumers)
        .filter(({ selectedNewVariableId }) => selectedNewVariableId === null).length;

  // 자동 연결 기능
  function bulkApply() {
    if (!results) return;

    for (const { oldValue, consumers, suggestions } of results) {
      if (suggestions.length !== 1) {
        // V2 컴포넌트도 컬러 검사 옵션이 *꺼져* 있는 경우에는
        // gray-900 -> gray-1000 + 시맨틱 토큰 조합에서 추천 2+인 경우에도 자동 연결 (시맨틱으로 연결)
        if (oldValue.type === "style" && oldValue.style.name.endsWith("gray-900")) {
          const semanticSuggestions = suggestions.filter(
            ({ variable: { name } }) =>
              name.startsWith(SEED_V3_LIBRARY_VARIABLE_PREFIXES.COLOR.BG) ||
              name.startsWith(SEED_V3_LIBRARY_VARIABLE_PREFIXES.COLOR.FG) ||
              name.startsWith(SEED_V3_LIBRARY_VARIABLE_PREFIXES.COLOR.STROKE),
          );

          if (semanticSuggestions.length !== 1) continue;

          applyColorVariable({
            oldValue,
            consumerNodeIds: consumers.map(({ node: { id } }) => id),
            variableId: semanticSuggestions[0].variable.id,
          });
        }

        continue;
      }

      applyColorVariable({
        oldValue,
        consumerNodeIds: consumers.map(({ node: { id } }) => id),
        variableId: suggestions[0].variable.id,
      });
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
          <LayersWithColorList />
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
        actionTooltip="추천 토큰이 1개인 항목에 자동으로 추천을 적용합니다. 추천이 없거나 2개 이상인 항목은 변경되지 않습니다."
        onRefresh={requestSuggestions}
        showRefreshButton={true}
      />
    </Flex>
  );
}
