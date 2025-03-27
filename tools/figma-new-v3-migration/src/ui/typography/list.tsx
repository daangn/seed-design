import {
  IconChevronDownLine,
  IconChevronUpLine,
  IconTUppercaseSerifLine,
} from "@daangn/react-monochrome-icon";
import { Flex, Stack, Text } from "@seed-design/react";
import { Collapsible, CollapsibleGroup } from "common/components/collapsible";
import { ProgressBar } from "common/components/progress-bar";
import { useMemo } from "react";
import { events } from "shared/event";
import type { SerializedTextStyleSuggestionsResults } from "shared/types";
import { useTypographyMigration, type ListEntry } from "./context";

export function TextStylesList() {
  const { results, progress } = useTypographyMigration();

  // 모든 그룹 ID 목록 (초기에 모두 펼친 상태로 설정)
  const defaultOpenItems = useMemo(() => {
    if (!results) return [];
    return results.map((group) => group.groupId);
  }, [results]);

  // 그룹 정렬: 적용되지 않은 항목이 있는 그룹을 상단으로, 모두 적용된 그룹을 하단으로 정렬
  const sortedResults = useMemo(() => {
    if (!results) return [];

    return [...results].sort((a, b) => {
      const aAllSelected = a.items.every((item) => item.selectedNewTextStyleId !== null);
      const bAllSelected = b.items.every((item) => item.selectedNewTextStyleId !== null);

      if (aAllSelected && !bAllSelected) return 1; // a를 아래로
      if (!aAllSelected && bAllSelected) return -1; // a를 위로
      return 0;
    });
  }, [results]);

  if (!results) {
    return (
      <Flex justifyContent="center" alignItems="center" style={{ height: "100%", width: "100%" }}>
        <Text fontSize="t1" color="palette.gray700">
          프레임 검사를 해주세요.
        </Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" style={{ height: "100%" }}>
      <CollapsibleGroup defaultOpenItems={defaultOpenItems}>
        {/* 전체 접기/펴기 컨트롤 */}
        <Flex
          justifyContent="spaceBetween"
          alignItems="center"
          padding="x2"
          borderBottomWidth={1}
          borderColor="palette.gray200"
        >
          <Text fontSize="t2">텍스트 스타일</Text>
          <CollapsibleGroup.ToggleAll>
            {({ isAllOpen }) => (
              <Flex gap="x1" alignItems="center">
                <Text fontSize="t1" color="palette.gray700">
                  {isAllOpen ? "전체 접기" : "전체 펼치기"}
                </Text>
                {isAllOpen ? (
                  <IconChevronUpLine size={16} color="var(--seed-scale-color-gray-700)" />
                ) : (
                  <IconChevronDownLine size={16} color="var(--seed-scale-color-gray-700)" />
                )}
              </Flex>
            )}
          </CollapsibleGroup.ToggleAll>
        </Flex>

        {/* 그룹 목록 */}
        <Stack flexGrow={1} overflowY="auto" gap="x3">
          {sortedResults.map((group) => (
            <Collapsible key={group.groupId} id={group.groupId}>
              <Stack borderBottomWidth={1} borderColor="palette.gray200">
                <TextStyleGroup groupId={group.groupId} itemCount={group.items.length} />
                <Collapsible.Content>
                  {group.items.map((item) => (
                    <TextLayer key={item.textNode.id} groupId={group.groupId} item={item} />
                  ))}
                </Collapsible.Content>
              </Stack>
            </Collapsible>
          ))}
        </Stack>
      </CollapsibleGroup>
      {progress.total > 0 && (
        <ProgressBar progress={progress} showTitle completeMessage="모두 변경 완료" />
      )}
    </Flex>
  );
}

function TextStyleGroup({
  groupId,
  itemCount,
}: Pick<ListEntry, "groupId"> & { itemCount: number }) {
  const { results, setCurrentlyViewingEntryId, currentlyViewing } = useTypographyMigration();
  if (!results) return null;

  const group = results.find(({ groupId: id }) => id === groupId);
  if (!group) return null;

  const isCurrentlyViewing = useMemo(
    () => currentlyViewing?.group?.groupId === groupId && !currentlyViewing?.item,
    [currentlyViewing, groupId],
  );

  const isAllItemsSelected = group.items.every((item) => item.selectedNewTextStyleId !== null);
  const selectedItemsCount = group.items.filter(
    (item) => item.selectedNewTextStyleId !== null,
  ).length;

  function handleClick() {
    setCurrentlyViewingEntryId({ groupId });
    if (!group || !group.items) return;

    const nodeIds = group.items.map((item) => item.textNode.id);
    if (nodeIds.length > 0) {
      events("focus-node").emit({ nodeIds });
    }
  }

  return (
    <Flex
      justifyContent="spaceBetween"
      alignItems="center"
      background={isCurrentlyViewing ? "bg.informativeWeak" : "bg.layerDefault"}
      padding="x2"
      style={{
        // 이미 모든 아이템이 적용된 그룹은 시각적으로 구분
        ...(isAllItemsSelected && {
          opacity: 0.5,
          textDecoration: "line-through",
        }),
      }}
    >
      {/* 그룹 정보 */}
      <Flex gap="x1" alignItems="center" onClick={handleClick} style={{ cursor: "pointer" }}>
        <IconTUppercaseSerifLine size={14} />
        <Text fontSize="t2" fontWeight="bold">
          {groupId}
        </Text>
        <Text fontSize="t1" color="palette.gray600" style={{ marginLeft: "4px" }}>
          ({itemCount})
        </Text>
        {selectedItemsCount > 0 && selectedItemsCount < itemCount && (
          <Text fontSize="t1" color="fg.positive" style={{ marginLeft: "4px" }}>
            {selectedItemsCount}/{itemCount} 적용됨
          </Text>
        )}
      </Flex>

      {/* 접기/펴기 버튼 */}
      <Collapsible.Trigger>
        {({ isOpen }) =>
          isOpen ? (
            <IconChevronUpLine size={16} color="var(--seed-scale-color-gray-700)" />
          ) : (
            <IconChevronDownLine size={16} color="var(--seed-scale-color-gray-700)" />
          )
        }
      </Collapsible.Trigger>
    </Flex>
  );
}

function TextLayer({
  groupId,
  item,
}: {
  groupId: ListEntry["groupId"];
  item: SerializedTextStyleSuggestionsResults[number];
}) {
  const { setCurrentlyViewingEntryId, currentlyViewing } = useTypographyMigration();

  const { textNode, selectedNewTextStyleId, closestInstanceNode } = item;

  const isAlreadyMigrated = !!selectedNewTextStyleId;

  function handleClick() {
    if (isAlreadyMigrated) return;
    setCurrentlyViewingEntryId({ groupId, itemId: textNode.id });
    events("focus-node").emit({ nodeIds: [textNode.id] });
  }

  // 현재 아이템이 선택되었는지 확인
  const isItemSelected = currentlyViewing?.item?.textNode.id === textNode.id;

  // 현재 아이템의 그룹이 선택되었는지 확인 (아이템이 선택되지 않은 상태에서)
  const isParentGroupSelected =
    currentlyViewing && !currentlyViewing.item && currentlyViewing.group?.groupId === groupId;

  // 아이템이 선택되었거나 부모 그룹이 선택되었을 때 하이라이트
  const isHighlighted = isItemSelected || isParentGroupSelected;

  const displayText = textNode.characters || "<빈 텍스트>";
  const truncatedText =
    displayText.length > 30 ? `${displayText.substring(0, 30)}...` : displayText;

  return (
    <Flex
      onClick={handleClick}
      gap="x1"
      alignItems="center"
      padding="x1"
      paddingLeft="x4"
      background={isHighlighted ? "bg.informativeWeak" : "bg.layerDefault"}
      style={{
        cursor: "pointer",
        ...(isAlreadyMigrated && { opacity: 0.5, textDecoration: "line-through" }),
      }}
    >
      <Text fontSize="t1">{truncatedText}</Text>
      {closestInstanceNode && (
        <Text fontSize="t1" color="palette.gray700">
          인스턴스
        </Text>
      )}
    </Flex>
  );
}
