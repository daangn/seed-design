import { IconTUppercaseSerifLine } from "@daangn/react-monochrome-icon";
import { Flex, Stack, Text } from "@seed-design/react";
import { ProgressBar } from "common/components/progress-bar";
import { useMemo } from "react";
import { events } from "shared/event";
import type { SerializedTextStyleSuggestionsResults } from "shared/types";
import { useTypographyMigration, type ListEntry } from "./context";

export function TextStylesList() {
  const { results, progress } = useTypographyMigration();

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
      <Stack flexGrow={1} gap="x3">
        {results.map((group) => (
          <Stack key={group.groupId} borderBottomWidth={1} borderColor="palette.gray200">
            <TextStyleGroup groupId={group.groupId} />
            {group.items.map((item) => (
              <TextLayer key={item.textNode.id} groupId={group.groupId} item={item} />
            ))}
          </Stack>
        ))}
      </Stack>
      <ProgressBar progress={progress} showTitle completeMessage="모두 변경 완료" />
    </Flex>
  );
}

function TextStyleGroup({ groupId }: Pick<ListEntry, "groupId">) {
  const { results, setCurrentlyViewingEntryId, currentlyViewing } = useTypographyMigration();
  if (!results) return null;

  const group = results.find(({ groupId: id }) => id === groupId);
  if (!group) return null;

  const isCurrentlyViewing = useMemo(
    () => currentlyViewing?.group?.groupId === groupId && !currentlyViewing?.item,
    [currentlyViewing, groupId],
  );

  const isAllItemsSelected = group.items.every((item) => item.selectedNewTextStyleId !== null);

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
      onClick={handleClick}
      gap="x1"
      alignItems="center"
      background={isCurrentlyViewing ? "bg.informativeWeak" : "bg.layerDefault"}
      padding="x2"
      style={{
        cursor: "pointer",
        ...(isAllItemsSelected && {
          opacity: 0.5,
          textDecoration: "line-through",
        }),
      }}
    >
      <IconTUppercaseSerifLine size={14} />
      <Text fontSize="t2" fontWeight="bold">
        {groupId}
      </Text>
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
