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

  const { textNode, suggestions, selectedNewTextStyleId } = currentlyViewing.item;
  const isAlreadyMigrated = suggestions.some(
    ({ textStyle }) => textStyle.id === selectedNewTextStyleId,
  );

  return (
    <Flex direction="column" height="full" overflowY="hidden">
      {/* 헤더 영역 */}
      <Flex direction="column" gap="x1" paddingTop="x3" paddingX="x3">
        <Flex gap="x1" alignItems="center" style={{ minWidth: 0, width: "100%" }}>
          <Text fontSize="t2" color="palette.gray700" style={{ flexShrink: 0 }}>
            텍스트 레이어
          </Text>
          <Text
            fontSize="t4"
            fontWeight="bold"
            style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {textNode.characters || "<빈 텍스트>"}
          </Text>
        </Flex>
        <Flex gap="x1" alignItems="center" style={{ minWidth: 0, width: "100%" }}>
          <Text fontSize="t2" color="palette.gray700" style={{ flexShrink: 0 }}>
            현재 typography
          </Text>
          <Text
            fontSize="t2"
            fontWeight="bold"
            style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {currentlyViewing.group?.groupId || "불명확한 스타일"}
          </Text>
        </Flex>
      </Flex>

      {/* 변수 선택 영역 */}
      <Flex direction="column" gap="x3" padding="x3" flexGrow={1} overflowY="auto">
        <Text fontSize="t2" color="palette.gray700">
          {suggestions.length === 0
            ? "이 typography는 더 이상 사용되지 않습니다. 다른 typography을 선택해주세요."
            : "이 레이어에 설정할 typography을 선택하세요."}
        </Text>
        {suggestions.map((suggestion) => (
          <TextStyleSuggestionButton
            onClick={() => setSelectedTextStyleId(suggestion.textStyle.id)}
            key={suggestion.textStyle.id}
            isSelected={selectedTextStyleId === suggestion.textStyle.id}
            isHighlighted={suggestion.textStyle.id === selectedNewTextStyleId}
            suggestion={suggestion}
          />
        ))}
        <ActionButton
          variant="brandSolid"
          onClick={() =>
            applyTextStyle({
              textNodeIds: [textNode.id],
              textStyleId: selectedTextStyleId ?? "",
            })
          }
          disabled={!selectedTextStyleId || isAlreadyMigrated}
        >
          {isAlreadyMigrated ? "이미 적용됨" : "적용하기"}
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
        <Flex direction="column" gap="x1" style={{ width: "100%", minWidth: 0 }}>
          <Text
            fontSize="t4"
            fontWeight="bold"
            style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {groupId}
          </Text>
          <Text fontSize="t2" color="palette.gray800">
            Typography
          </Text>
        </Flex>
      </Flex>

      {/* 변수 선택 영역 */}
      <Flex direction="column" gap="x3" padding="x3" flexGrow={1} overflowY="auto">
        <Text fontSize="t2" color="palette.gray700">
          {isAllItemsMigrated
            ? "이미 모든 텍스트 노드에 적용됨 (typography에서 확인 가능)"
            : suggestions.length === 0
              ? "이 typography는 더 이상 사용되지 않습니다. 다른 typography을 선택해주세요."
              : "이 typography을 적용할 새 typography을 선택하세요."}
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
  isHighlighted,
  suggestion,
  onClick,
}: {
  isSelected?: boolean;
  isHighlighted?: boolean;
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
      background={
        isHighlighted ? "palette.carrot100" : isSelected ? "bg.neutralWeak" : "bg.layerDefault"
      }
      borderColor={
        isHighlighted ? "palette.carrot200" : isSelected ? "stroke.neutral" : "stroke.neutralMuted"
      }
      style={{ cursor: "pointer" }}
      borderWidth={1}
    >
      <Flex direction="column" gap="x1" flexGrow={1} style={{ minWidth: 0 }}>
        <Text
          fontSize="t1"
          fontWeight="bold"
          style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
        >
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
