import { Box, Flex } from "@seed-design/react";
import { Footer } from "common/components/footer";
import { SEED_V3_LIBRARY_VARIABLE_PREFIXES } from "shared/constants";
import type { SerializedColorVariablesSuggestionsResults } from "shared/types";
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
  const { results, applyColorVariable, requestSuggestions, setResults } = useColorMigration();

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

          // fg 관련 노드이고, fg suggestion이 하나뿐이면 fg 컬러로 자동 매칭
          if (oldValue.type === "style" && oldValue.paletteProperty === "fg") {
            const fgColors = suggestions.filter(({ variable }) => variable.name.startsWith("fg"));
            if (fgColors.length === 1) return true;
          }

          // bg 관련 노드이고, bg suggestion이 하나뿐이면 bg 컬러로 자동 매칭
          if (oldValue.type === "style" && oldValue.paletteProperty === "bg") {
            const bgColors = suggestions.filter(({ variable }) => variable.name.startsWith("bg"));
            if (bgColors.length === 1) return true;
          }

          // stroke 관련 노드이고, stroke suggestion이 하나뿐이면 stroke 컬러로 자동 매칭
          if (oldValue.type === "style" && oldValue.paletteProperty === "stroke") {
            const strokeColors = suggestions.filter(({ variable }) =>
              variable.name.startsWith("stroke"),
            );
            if (strokeColors.length === 1) return true;
          }

          return false;
        })
        .flatMap(({ consumers }) => consumers)
        .filter(({ selectedNewVariableId }) => selectedNewVariableId === null).length;

  // 결과 정렬 함수 (적용되지 않은 항목을 위로, 적용된 항목을 아래로 정렬)
  const sortResultsByUnselectedCount = () => {
    setResults((prev: SerializedColorVariablesSuggestionsResults | null) => {
      if (!prev) return prev;

      return [...prev].sort((a, b) => {
        const aUnselectedCount = a.consumers.filter(
          (consumer) => consumer.selectedNewVariableId === null,
        ).length;

        const bUnselectedCount = b.consumers.filter(
          (consumer) => consumer.selectedNewVariableId === null,
        ).length;

        // 미적용 항목(selectedNewVariableId가 null인 consumer)이 많은 그룹이 위로
        if (aUnselectedCount === 0 && bUnselectedCount > 0) return 1;
        if (aUnselectedCount > 0 && bUnselectedCount === 0) return -1;

        return bUnselectedCount - aUnselectedCount;
      });
    });
  };

  // 자동 연결 기능
  function bulkApply() {
    if (!results) return;

    // 적용할 항목들을 먼저 수집
    const itemsToApply = [];

    for (const { oldValue, consumers, suggestions } of results) {
      // 이미 모든 consumer가 적용된 경우 건너뛰기
      const hasUnselectedConsumers = consumers.some(
        (consumer) => consumer.selectedNewVariableId === null,
      );
      if (!hasUnselectedConsumers) continue;

      // 추천이 1개인 경우
      if (suggestions.length === 1) {
        itemsToApply.push({
          oldValue,
          consumerNodeIds: consumers
            .filter((consumer) => consumer.selectedNewVariableId === null)
            .map(({ node: { id } }) => id),
          variableId: suggestions[0].variable.id,
        });
        continue;
      }

      // fg 관련 노드이고, fg suggestion이 하나뿐이면 fg 컬러로 자동 매칭
      if (
        suggestions.length >= 2 &&
        oldValue.type === "style" &&
        oldValue.paletteProperty === "fg"
      ) {
        const fgColors = suggestions.filter(({ variable }) => variable.name.startsWith("fg"));
        if (fgColors.length === 1) {
          itemsToApply.push({
            oldValue,
            consumerNodeIds: consumers.map(({ node: { id } }) => id),
            variableId: fgColors[0].variable.id,
          });
        }
      }

      // bg 관련 노드이고, bg suggestion이 하나뿐이면 bg 컬러로 자동 매칭
      if (
        suggestions.length >= 2 &&
        oldValue.type === "style" &&
        oldValue.paletteProperty === "bg"
      ) {
        const bgColors = suggestions.filter(({ variable }) => variable.name.startsWith("bg"));
        if (bgColors.length === 1) {
          itemsToApply.push({
            oldValue,
            consumerNodeIds: consumers.map(({ node: { id } }) => id),
            variableId: bgColors[0].variable.id,
          });
        }
      }

      // stroke 관련 노드이고, stroke suggestion이 하나뿐이면 stroke 컬러로 자동 매칭
      if (
        suggestions.length >= 2 &&
        oldValue.type === "style" &&
        oldValue.paletteProperty === "stroke"
      ) {
        const strokeColors = suggestions.filter(({ variable }) =>
          variable.name.startsWith("stroke"),
        );
        if (strokeColors.length === 1) {
          itemsToApply.push({
            oldValue,
            consumerNodeIds: consumers.map(({ node: { id } }) => id),
            variableId: strokeColors[0].variable.id,
          });
        }
      }

      // V2 컴포넌트도 컬러 검사 옵션이 *꺼져* 있는 경우에는
      // gray-900 -> gray-1000 + 시맨틱 토큰 조합에서 추천 2+인 경우에도 자동 연결 (시맨틱으로 연결)
      if (oldValue.type === "style" && oldValue.style.name.endsWith("gray-900")) {
        const semanticSuggestions = suggestions.filter(
          ({ variable: { name } }) =>
            name.startsWith(SEED_V3_LIBRARY_VARIABLE_PREFIXES.COLOR.BG) ||
            name.startsWith(SEED_V3_LIBRARY_VARIABLE_PREFIXES.COLOR.FG) ||
            name.startsWith(SEED_V3_LIBRARY_VARIABLE_PREFIXES.COLOR.STROKE),
        );

        if (semanticSuggestions.length === 1) {
          itemsToApply.push({
            oldValue,
            consumerNodeIds: consumers
              .filter((consumer) => consumer.selectedNewVariableId === null)
              .map(({ node: { id } }) => id),
            variableId: semanticSuggestions[0].variable.id,
          });
        }
      }
    }

    // 수집된 항목들 적용
    for (const item of itemsToApply) {
      applyColorVariable(item);
    }

    // 적용 후 결과 정렬
    sortResultsByUnselectedCount();
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
