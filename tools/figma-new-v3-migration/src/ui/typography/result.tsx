import { ActionButton, Flex, Text } from "@seed-design/react";
import type { SerializedTextStyleSuggestionsResults } from "shared/types";
import { useTypographyMigration } from "./context";

export function Result() {
  const { currentlyViewing } = useTypographyMigration();

  if (currentlyViewing?.item) return <TextLayerResult />;
  if (currentlyViewing?.group) return <TextLayerGroupResult />;

  // 선택된 항목이 없을 때 빈 안내 화면 추가
  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      style={{
        height: "100%",
        padding: "24px",
        color: "var(--seed-scale-color-neutral-500)",
      }}
    >
      <Text fontSize="t3" style={{ marginBottom: "8px" }}>
        왼쪽에서 항목을 선택해주세요
      </Text>
    </Flex>
  );
}

function TextLayerResult() {
  const { currentlyViewing, applyTextStyle, selectedTextStyleId, setSelectedTextStyleId } =
    useTypographyMigration();

  if (!currentlyViewing?.item) return null;

  const { textNode, suggestions } = currentlyViewing.item;

  return (
    <Flex direction="column" height="full" overflowY="hidden">
      {/* 헤더 영역 */}
      <Flex direction="column" gap="x1" paddingTop="x3" paddingX="x3">
        <Flex gap="x1" alignItems="center">
          <Text fontSize="t2" color="palette.gray700">
            텍스트 레이어
          </Text>
          <Text fontSize="t4" fontWeight="bold">
            {textNode.characters || "<빈 텍스트>"}
          </Text>
        </Flex>
        <Flex gap="x1" alignItems="center">
          <Text fontSize="t2" color="palette.gray700">
            현재 텍스트 스타일
          </Text>
          <Text fontSize="t2" fontWeight="bold">
            {currentlyViewing.group?.groupId || "불명확한 스타일"}
          </Text>
        </Flex>
      </Flex>

      {/* 변수 선택 영역 */}
      <Flex direction="column" gap="x3" padding="x3" flexGrow={1} overflowY="auto">
        <Text fontSize="t2" color="palette.gray700">
          {suggestions.length === 0
            ? "이 텍스트 스타일은 더 이상 사용되지 않습니다. 다른 텍스트 스타일을 선택해주세요."
            : "이 레이어에 설정할 텍스트 스타일을 선택하세요."}
        </Text>
        {suggestions.map((suggestion) => (
          <TextStyleSuggestionButton
            onClick={() => setSelectedTextStyleId(suggestion.textStyle.id)}
            key={suggestion.textStyle.id}
            isSelected={selectedTextStyleId === suggestion.textStyle.id}
            suggestion={suggestion}
          />
        ))}
        <ActionButton
          variant="neutralSolid"
          onClick={() =>
            applyTextStyle({
              textNodeIds: [textNode.id],
              textStyleId: selectedTextStyleId ?? "",
            })
          }
          disabled={!selectedTextStyleId}
        >
          적용하기
        </ActionButton>
      </Flex>
    </Flex>
  );
}

function TextLayerGroupResult() {
  const { currentlyViewing, applyTextStyle, selectedTextStyleId, setSelectedTextStyleId } =
    useTypographyMigration();

  if (!currentlyViewing?.group) return null;

  const { groupId } = currentlyViewing.group;

  // 그룹의 모든 텍스트 노드 ID 가져오기
  const textNodeIds = currentlyViewing.group.items.map((item) => item.textNode.id);

  // 그룹의 첫 번째 아이템을 기준으로 사용
  const firstItem = currentlyViewing.group.items[0];
  if (!firstItem) return null;

  const { suggestions } = firstItem;
  const isAllItemsMigrated = currentlyViewing.group.items.every(
    (item) => item.selectedNewTextStyleId !== null,
  );

  return (
    <Flex direction="column" style={{ height: "100%", overflow: "hidden" }}>
      {/* 헤더 영역 */}
      <Flex gap="x1" paddingTop="x3" paddingX="x3">
        <Flex direction="column" gap="x1">
          <Text fontSize="t4" fontWeight="bold">
            {groupId}
          </Text>
          <Text fontSize="t2" color="palette.gray800">
            텍스트 스타일
          </Text>
        </Flex>
      </Flex>

      {/* 변수 선택 영역 */}
      <Flex direction="column" gap="x3" padding="x3" flexGrow={1} overflowY="auto">
        <Text fontSize="t2" color="palette.gray700">
          {suggestions.length === 0
            ? "이 텍스트 스타일은 더 이상 사용되지 않습니다. 다른 텍스트 스타일을 선택해주세요."
            : "이 텍스트 스타일을 적용할 새 텍스트 스타일을 선택하세요."}
        </Text>
        {suggestions.map((suggestion) => (
          <TextStyleSuggestionButton
            onClick={() => setSelectedTextStyleId(suggestion.textStyle.id)}
            key={suggestion.textStyle.id}
            suggestion={suggestion}
            isSelected={selectedTextStyleId === suggestion.textStyle.id}
          />
        ))}
        <ActionButton
          variant="neutralSolid"
          onClick={() =>
            applyTextStyle({
              textNodeIds,
              textStyleId: selectedTextStyleId ?? "",
            })
          }
          disabled={!selectedTextStyleId || isAllItemsMigrated}
        >
          {isAllItemsMigrated ? "이미 적용됨" : "적용하기"}
        </ActionButton>
      </Flex>
    </Flex>
  );
}

function TextStyleSuggestionButton({
  isSelected,
  suggestion,
  onClick,
}: {
  isSelected?: boolean;
  suggestion: SerializedTextStyleSuggestionsResults[number]["suggestions"][number];
  onClick: () => void;
  disabled?: boolean;
}) {
  const { textStyle, differences } = suggestion;

  function getLineHeightUnitString(
    lineHeight: any,
    fontSize: number,
    includeValue = false,
  ): string {
    const lineHeightValue = typeof lineHeight === "object" ? lineHeight.value : lineHeight;
    const lineHeightPercent = Math.round((lineHeightValue / fontSize) * 100);
    return includeValue ? `${lineHeightValue}px (${lineHeightPercent}%)` : `${lineHeightPercent}%`;
  }

  return (
    <Flex
      gap="x2"
      onClick={onClick}
      padding="x2"
      borderRadius="r2"
      alignItems="center"
      background={isSelected ? "bg.neutralWeak" : "bg.layerDefault"}
      borderColor={isSelected ? "stroke.neutral" : "stroke.neutralMuted"}
      style={{ cursor: "pointer" }}
      borderWidth={1}
    >
      <Flex direction="column" gap="x1" flexGrow={1}>
        <Text fontSize="t1" fontWeight="bold">
          {textStyle.name}
        </Text>
        <Flex gap="x2">
          <Text
            fontSize="t1"
            color={differences?.fontSize !== 0 ? "palette.red500" : "palette.gray900"}
          >
            {textStyle.fontSize}px
          </Text>
          <Text
            fontSize="t1"
            color={differences?.fontWeight !== 0 ? "palette.red500" : "palette.gray900"}
          >
            {textStyle.fontNameStyle}
          </Text>
          <Text
            fontSize="t1"
            color={differences?.lineHeight !== 0 ? "palette.red500" : "palette.gray900"}
          >
            {getLineHeightUnitString(textStyle.lineHeight, textStyle.fontSize, true)}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
