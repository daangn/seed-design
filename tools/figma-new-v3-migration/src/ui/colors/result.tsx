import { ActionButton, Box, Flex, Text } from "@seed-design/react";
import type { SerializedColorVariablesSuggestionsResults, SerializedVariable } from "shared/types";
import { getOldFullValueName, getOldValueName, useColorMigration } from "./context";

export function Result() {
  const { currentlyViewing } = useColorMigration();

  if (currentlyViewing?.item) return <LayerResult />;
  if (currentlyViewing?.group) return <LayerGroupResult />;

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

function LayerResult() {
  const { currentlyViewing, applyColorVariable, selectedVariableId, setSelectedVariableId } =
    useColorMigration();

  if (!currentlyViewing?.item) return null;

  const { oldValue, suggestions } = currentlyViewing.group;
  const { node, properties } = currentlyViewing.item;

  return (
    <Flex direction="column" height="full" overflowY="hidden">
      {/* 헤더 영역 */}
      <Flex direction="column" gap="x1" paddingTop="x3" paddingX="x3">
        <Flex gap="x1" alignItems="center">
          <Text fontSize="t2" color="palette.gray700">
            프레임
          </Text>
          <Text fontSize="t4" fontWeight="bold">
            {node.name}
          </Text>
        </Flex>
        <Flex gap="x1" alignItems="center">
          <Text fontSize="t2" color="palette.gray700">
            사용중인 색상
          </Text>
          <Text fontSize="t2" fontWeight="bold">
            {getOldValueName(oldValue)} {properties.join(", ")}
          </Text>
        </Flex>
      </Flex>

      {/* 변수 선택 영역 */}
      <Flex direction="column" gap="x3" padding="x3" flexGrow={1} overflowY="auto">
        <Text fontSize="t2" color="palette.gray700">
          {suggestions.length === 0 &&
            (oldValue.type === "style"
              ? "이 스타일은 더 이상 사용되지 않습니다. 디자인코어팀에 문의해주세요."
              : "추천된 Variable이 없습니다. 직접 설정해주세요.")}
          {suggestions.length > 0 && "이 레이어에 설정할 Variable을 선택하세요."}
        </Text>
        {suggestions.map((suggestion) => (
          <VariableSuggestionButton
            onClick={() => setSelectedVariableId(suggestion.variable.id)}
            key={suggestion.variable.id}
            isSelected={selectedVariableId === suggestion.variable.id}
            suggestion={suggestion}
          />
        ))}
        <ActionButton
          variant="neutralSolid"
          onClick={() =>
            applyColorVariable({
              oldValue,
              consumerNodeIds: [node.id],
              variableId: selectedVariableId ?? "",
            })
          }
          disabled={!selectedVariableId}
        >
          적용하기
        </ActionButton>
      </Flex>
    </Flex>
  );
}

function LayerGroupResult() {
  const { currentlyViewing, applyColorVariable, selectedVariableId, setSelectedVariableId } =
    useColorMigration();

  if (!currentlyViewing?.group) return null;

  const { oldValue, suggestions, consumers } = currentlyViewing.group;

  const isAllItemsMigrated = consumers.every(({ selectedNewVariableId }) => selectedNewVariableId);

  return (
    <Flex direction="column" style={{ height: "100%", overflow: "hidden" }}>
      {/* 헤더 영역 */}
      <Flex gap="x1" paddingTop="x3" paddingX="x3">
        <Flex direction="column" gap="x1">
          <Text fontSize="t4" fontWeight="bold">
            {getOldFullValueName(oldValue)}
          </Text>
          <Text fontSize="t2" color="palette.gray800">
            을 사용중인 모든 곳에 적용 ({consumers.length}개)
          </Text>
        </Flex>
      </Flex>

      {/* 변수 선택 영역 */}
      <Flex direction="column" gap="x3" padding="x3" flexGrow={1} overflowY="auto">
        <Text fontSize="t2" color="palette.gray700">
          {suggestions.length === 0 &&
            (oldValue.type === "style"
              ? "이 스타일은 더 이상 사용되지 않습니다. 디자인코어팀에 문의해주세요."
              : "추천된 Variable이 없습니다. 직접 설정해주세요.")}
          {suggestions.length > 0 && "이 레이어에 설정할 Variable을 선택하세요."}
        </Text>
        {suggestions.map((suggestion) => (
          <VariableSuggestionButton
            onClick={() => setSelectedVariableId(suggestion.variable.id)}
            key={suggestion.variable.id}
            suggestion={suggestion}
            isSelected={selectedVariableId === suggestion.variable.id}
          />
        ))}
        <ActionButton
          variant="neutralSolid"
          onClick={() =>
            applyColorVariable({
              oldValue,
              consumerNodeIds: consumers.map(({ node }) => node.id),
              variableId: selectedVariableId ?? "",
            })
          }
          disabled={!selectedVariableId || isAllItemsMigrated}
        >
          {isAllItemsMigrated ? "모두 적용됨" : `${consumers.length}개 레이어에 적용하기`}
        </ActionButton>
      </Flex>
    </Flex>
  );
}

function VariableSuggestionButton({
  isSelected,
  suggestion,
  onClick,
}: {
  isSelected?: boolean;
  suggestion: SerializedColorVariablesSuggestionsResults[number]["suggestions"][number];
  onClick: (variable: SerializedVariable) => void;
  disabled?: boolean;
}) {
  return (
    <Flex
      gap="x2"
      onClick={() => onClick(suggestion.variable)}
      padding="x2"
      borderRadius="r2"
      alignItems="center"
      background={isSelected ? "bg.neutralWeak" : "bg.layerDefault"}
      borderColor={isSelected ? "stroke.neutral" : "stroke.neutralMuted"}
      style={{ cursor: "pointer" }}
      borderWidth={1}
    >
      <ColorChip backgroundColor={`#${suggestion.hex}`} opacity={suggestion.opacity} />
      <Flex direction="column" gap="x1">
        <Text fontSize="t1" fontWeight="bold">
          {suggestion.variable.name}
        </Text>
        <Text fontSize="t1" color="palette.gray900">
          #{suggestion.hex}
        </Text>
      </Flex>
    </Flex>
  );
}

function ColorChip({
  backgroundColor,
  opacity = 1,
}: { backgroundColor: string; opacity?: number }) {
  return (
    <Box
      borderWidth={1}
      borderColor="palette.gray200"
      borderRadius="r2"
      width="x5"
      height="x5"
      style={{
        backgroundColor,
        opacity,
      }}
    />
  );
}
